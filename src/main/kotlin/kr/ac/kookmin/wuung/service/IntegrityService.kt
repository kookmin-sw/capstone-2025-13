package kr.ac.kookmin.wuung.service

import com.fasterxml.jackson.databind.ObjectMapper
import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtParser
import io.jsonwebtoken.Jwts
import kr.ac.kookmin.wuung.controller.IntegrityVerificationResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import java.security.KeyFactory
import java.security.PublicKey
import java.util.Date
import java.util.concurrent.TimeUnit
import com.google.auth.oauth2.GoogleCredentials
import com.google.auth.oauth2.AccessToken
import com.google.gson.Gson
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import java.io.ByteArrayInputStream
import java.util.Base64

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

    @Value("\${app.google-account-json}")
    private val googleAccountJson: String,
    private val gson: Gson,
) {
    companion object {
        var applePublicKey: PublicKey? = null
        var appleParser: JwtParser? = null
        private var googleAccessToken: AccessToken? = null
    }

    private val decodeIntegrityTokenUrl = "https://playintegrity.googleapis.com/v1/$packageName:decodeIntegrityToken"
    private val logger = LoggerFactory.getLogger(this::class.java)

    init {
        refreshGoogleAccessToken()
        val appleResponse = webClient.get()
            .uri("https://www.apple.com/certificateauthority/Apple_App_Attestation_Root_CA.pem")
            .accept(MediaType.APPLICATION_OCTET_STREAM)
            .retrieve()
            .bodyToMono(ByteArray::class.java)
            .block()

        if (appleResponse != null) {
            try {
                val keyFactory = KeyFactory.getInstance("RSA")
                val certFactory = java.security.cert.CertificateFactory.getInstance("X.509")
                val certificate = certFactory.generateCertificate(appleResponse.inputStream())
                applePublicKey = certificate.publicKey

                appleParser = Jwts.parser()
                    .setSigningKey(applePublicKey)
                    .build()
            } catch (e: Exception) {
                throw RuntimeException("Failed to process Apple public key: ${e.message}")
            }
        } else {
            throw RuntimeException("Failed to fetch Apple public key")
        }


    }

    @OptIn(DelicateCoroutinesApi::class)
    @Scheduled(fixedRate = 3300000) // Refresh every 55 minutes
    private fun refreshGoogleAccessToken() {
        GlobalScope.launch {
            try {
                val credentials = GoogleCredentials.fromStream(ByteArrayInputStream(googleAccountJson.toByteArray()))
                    .createScoped("https://www.googleapis.com/auth/playintegrity")
                credentials.refresh()
                googleAccessToken = credentials.accessToken
            } catch (e: Exception) {
                throw RuntimeException("Failed to refresh Google access token: ${e.message}")
            }
        }
    }

    fun verifyAndroidIntegrity(challenge: String, nonce: String): IntegrityVerificationResponse {
        return try {
            val decodedTokenBytes = webClient.post()
                .uri(decodeIntegrityTokenUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(mapOf("integrity_token" to challenge))
                .header("Authorization", "Bearer ${googleAccessToken?.tokenValue}")
                .retrieve()
                .bodyToMono(ByteArray::class.java)
                .block()

            if (decodedTokenBytes == null) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Decoded token is null"
                )
            }

            val decodedTokenJson = String(decodedTokenBytes)

            val decodeResponse: DecodeIntegrityTokenResponse = gson.fromJson(decodedTokenJson, DecodeIntegrityTokenResponse::class.java)
            val tokenPayload = decodeResponse.tokenPayloadExternal

            // Package Name Verification
            if (tokenPayload.appIntegrity.packageName != packageName) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Package name mismatch",
                    details = mapOf(
                        "expected" to packageName,
                        "actual" to tokenPayload.requestDetails.requestPackageName
                    )
                )
            }

            if (tokenPayload.requestDetails.nonce.replace("=", "").trim() !=
                nonce.replace("=", "").trim()
            ) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Challenge mismatch",
                    details = mapOf(
                        "expected" to nonce,
                        "actual" to tokenPayload.requestDetails.nonce
                    )
                )
            }

            // Timestamp Verification
            if (isTokenExpired(tokenPayload.requestDetails.timestampMillis)) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Token has expired",
                    details = mapOf("timestamp" to tokenPayload.requestDetails.timestampMillis)
                )
            }

            // App Integrity Verification
            if (tokenPayload.appIntegrity.appRecognitionVerdict != "PLAY_RECOGNIZED") {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "App not recognized by Google Play",
                    details = mapOf("verdict" to tokenPayload.appIntegrity.appRecognitionVerdict)
                )
            }

            // Device Integrity Verification
            if (!tokenPayload.deviceIntegrity.deviceRecognitionVerdict.contains("MEETS_DEVICE_INTEGRITY")) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Device integrity check failed",
                    details = mapOf("verdicts" to tokenPayload.deviceIntegrity.deviceRecognitionVerdict)
                )
            }

            IntegrityVerificationResponse(
                isValid = true,
                message = "Android app integrity verification successful"
            )

        } catch (e: Exception) {
            IntegrityVerificationResponse(
                isValid = false,
                message = "Error verifying integrity: ${e.message}",
                details = mapOf("errorType" to e.javaClass.simpleName)
            )
        }
    }

    private fun isTokenExpired(timestampMillis: Long): Boolean {
        val currentTime = System.currentTimeMillis()
        return currentTime - timestampMillis > TimeUnit.MINUTES.toMillis(5)
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
                claims = appleParser?.let {
                    it.parseClaimsJws(attestation)?.body ?: throw RuntimeException("Invalid JWT format")
                } ?: throw RuntimeException("JWT parser not initialized")
            } catch (e: Exception) {
                return IntegrityVerificationResponse(
                    isValid = false,
                    message = "Invalid JWT signature: ${e.message}",
                    details = mapOf("errorType" to e.javaClass.simpleName)
                )
            }

            logger.debug(claims.toList().joinToString { "${it.first} = ${it.second}" })

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

data class DecodeIntegrityTokenResponse(
    val tokenPayloadExternal: TokenPayload
)

data class TokenPayload(
    val appIntegrity: AppIntegrity,
    val deviceIntegrity: DeviceIntegrity,
    val requestDetails: RequestDetails,
    val accountDetails: AccountDetails?,
    val testingDetails: TestingDetails?
)

data class AppIntegrity(
    val appRecognitionVerdict: String,
    val packageName: String,
    val certificateSha256Digest: List<String>,
    val versionCode: String,
)

data class DeviceIntegrity(
    val deviceRecognitionVerdict: List<String>
)

data class RequestDetails(
    val requestPackageName: String,
    val nonce: String,
    val timestampMillis: Long
)

data class AccountDetails(
    val appLicensingVerdict: String,
)

data class TestingDetails(
    val isTestingResponse: Boolean,
)