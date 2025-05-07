package kr.ac.kookmin.wuung.service

import com.fasterxml.jackson.databind.ObjectMapper
import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtParser
import io.jsonwebtoken.JwtParserBuilder
import io.jsonwebtoken.Jwts
import kr.ac.kookmin.wuung.controller.IntegrityVerificationResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import java.security.KeyFactory
import java.security.PublicKey
import java.util.Base64
import java.util.Date
import java.util.concurrent.TimeUnit

@Service
class IntegrityService(
    @Autowired private val webClient: WebClient,
    @Value("\${app.package-name}")
    private val packageName: String,

    @Value("\${app.google-cloud-project-number}")
    private val projectNumber: String,

    @Value("\${app.google-cloud-api-key}")
    private val apiKey: String,

    @Value("\${app.apple-team-id}")
    private val teamId: String,

    @Value("\${app.apple-key-id}")
    private val keyId: String,
) {
    companion object {
        var applePublicKey: PublicKey? = null
        var parser: JwtParser? = null
    }

    private val objectMapper = ObjectMapper()

    init {
        val response = webClient.get()
            .uri("https://www.apple.com/certificateauthority/Apple_App_Attestation_Root_CA.pem")
            .accept(MediaType.APPLICATION_OCTET_STREAM)
            .retrieve()
            .bodyToMono(ByteArray::class.java)
            .block()

        if (response != null) {
            try {
                val keyFactory = KeyFactory.getInstance("RSA")
                val certFactory = java.security.cert.CertificateFactory.getInstance("X.509")
                val certificate = certFactory.generateCertificate(response.inputStream())
                applePublicKey = certificate.publicKey

                parser = Jwts.parser()
                    .setSigningKey(applePublicKey)
                    .build()
            } catch (e: Exception) {
                throw RuntimeException("Failed to process Apple public key: ${e.message}")
            }
        } else {
            throw RuntimeException("Failed to fetch Apple public key")
        }
    }

    fun verifyAndroidIntegrity(
        attestationJwt: String
    ): IntegrityVerificationResponse {
        try {
            // JWT 파싱
            val parts = attestationJwt.split(".")
            if (parts.size != 3) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Invalid JWT format"
                )
            }

            // 페이로드 디코딩
            val payload = String(Base64.getUrlDecoder().decode(parts[1]))
            val jsonPayload = objectMapper.readValue(payload, Map::class.java) as Map<String, Any>

            // 토큰 페이로드 검사
            val tokenPayload = jsonPayload["tokenPayload"] as? Map<String, Any> ?: return IntegrityVerificationResponse(
                isValid = false,
                message = "Invalid token payload"
            )

            // 앱 무결성 검증
            val appIntegrity = tokenPayload["appIntegrity"] as? Map<String, Any>
            val appRecognitionVerdict = appIntegrity?.get("appRecognitionVerdict") as? String

            if (appRecognitionVerdict != "PLAY_RECOGNIZED") {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "App not recognized by Google Play",
                    details = mapOf("verdict" to (appRecognitionVerdict ?: "UNKNOWN"))
                )
            }

            // 디바이스 무결성 검증
            val deviceIntegrity = tokenPayload["deviceIntegrity"] as? Map<String, Any>
            @Suppress("UNCHECKED_CAST")
            val deviceRecognitionVerdict = deviceIntegrity?.get("deviceRecognitionVerdict") as? List<String>

            if (deviceRecognitionVerdict == null || !deviceRecognitionVerdict.contains("MEETS_BASIC_INTEGRITY")) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Device does not meet basic integrity requirements",
                    details = mapOf("verdicts" to (deviceRecognitionVerdict ?: emptyList<String>()))
                )
            }

            // 패키지 이름 확인
            val requestDetails = tokenPayload["requestDetails"] as? Map<String, Any>
            val requestPackageName = requestDetails?.get("requestPackageName") as? String

            if (requestPackageName != packageName) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Package name mismatch",
                    details = mapOf(
                        "expected" to packageName,
                        "actual" to (requestPackageName ?: "null")
                    )
                )
            }

            // 타임스탬프 검증
            val timestampMillis = requestDetails?.get("timestampMillis") as? Long ?: 0
            val currentTimeMillis = System.currentTimeMillis()

            // 5분 이상 지난 토큰 거부
            if (currentTimeMillis - timestampMillis > TimeUnit.MINUTES.toMillis(5)) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Token has expired",
                    details = mapOf(
                        "tokenTime" to timestampMillis,
                        "currentTime" to currentTimeMillis
                    )
                )
            }

            return IntegrityVerificationResponse(
                isValid = true,
                message = "Android app integrity verification successful"
            )

        } catch (e: Exception) {
            return IntegrityVerificationResponse(
                isValid = false,
                message = "Error verifying integrity: ${e.message}",
                details = mapOf("errorType" to e.javaClass.simpleName)
            )
        }
    }

    fun verifyIosAppAttest(
        attestation: String,
        bundleId: String,
        challenge: String
    ): IntegrityVerificationResponse {
        try {
            if (applePublicKey == null) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Apple public key not available"
                )
            }

            // JWT 클레임 검증
            val claims: Claims
            try {
                claims = parser?.let {
                    it.parseClaimsJws(attestation)?.body ?: throw RuntimeException("Invalid JWT format")
                } ?: throw RuntimeException("JWT parser not initialized")
            } catch (e: Exception) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Invalid JWT signature: ${e.message}",
                    details = mapOf("errorType" to e.javaClass.simpleName)
                )
            }

            // 발급자(앱 번들 ID) 검증
            val tokenBundleId = claims["iss"] as? String
            if (tokenBundleId != bundleId) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Bundle ID mismatch",
                    details = mapOf(
                        "expected" to bundleId,
                        "actual" to (tokenBundleId ?: "null")
                    )
                )
            }

            // 챌린지 검증
            val tokenChallenge = claims["nonce"] as? String
            if (tokenChallenge != challenge) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Challenge mismatch",
                    details = mapOf(
                        "expected" to challenge,
                        "actual" to (tokenChallenge ?: "null")
                    )
                )
            }

            // 만료 시간 검증
            val expirationTime = claims.expiration
            if (expirationTime != null && expirationTime.before(Date())) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Token has expired",
                    details = mapOf("expiration" to expirationTime)
                )
            }

            // 앱 인증 타입 검증
            val attestType = claims["attestation_type"] as? String
            if (attestType != "appattestdevelop" && attestType != "appattestprod") {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Invalid attestation type",
                    details = mapOf("type" to (attestType ?: "null"))
                )
            }

            // 팀 ID 검증 (선택적)
            val tokenTeamId = claims["team_id"] as? String
            if (tokenTeamId != teamId) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Team ID mismatch",
                    details = mapOf(
                        "expected" to teamId,
                        "actual" to (tokenTeamId ?: "null")
                    )
                )
            }

            return IntegrityVerificationResponse(
                isValid = true,
                message = "iOS app attestation verified successfully"
            )

        } catch (e: Exception) {
            return IntegrityVerificationResponse(
                isValid = false,
                message = "Error verifying iOS attestation: ${e.message}",
                details = mapOf("errorType" to e.javaClass.simpleName)
            )
        }
    }
}