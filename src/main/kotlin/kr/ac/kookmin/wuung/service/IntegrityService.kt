package kr.ac.kookmin.wuung.service

import ch.veehait.devicecheck.appattest.AppleAppAttest
import ch.veehait.devicecheck.appattest.attestation.AttestationException
import ch.veehait.devicecheck.appattest.common.App
import ch.veehait.devicecheck.appattest.common.AppleAppAttestEnvironment
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
import java.nio.charset.StandardCharsets
import java.security.MessageDigest
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate
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
    private val decodeIntegrityTokenUrl = "https://playintegrity.googleapis.com/v1/$packageName:decodeIntegrityToken"
    private val logger = LoggerFactory.getLogger(this::class.java)

    lateinit var attest: AppleAppAttest
    lateinit var googleAccessToken: AccessToken

    init {
        refreshGoogleAccessToken()
        attest = AppleAppAttest(
            app = App(teamId, packageName),
            appleAppAttestEnvironment = AppleAppAttestEnvironment.PRODUCTION
        )
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
        keyId: String?,
        challenge: String
    ): IntegrityVerificationResponse {
        try {
            val validator = attest.createAttestationValidator()

            val result = validator.validate(
                Base64.getDecoder().decode(attestation),
                keyId ?: "",
                Base64.getDecoder().decode(challenge)
            )
            // 라이브러리의 validate 메소드는 검증 실패 시 AttestationException을 throw 합니다.
            // 여기까지 도달했다는 것은 검증에 성공했다는 의미입니다.
            return IntegrityVerificationResponse(
                isValid = true,
                message = "iOS app attestation verified successfully"
                // 필요한 경우 'result' 객체에서 추가 정보를 추출하여 details에 포함
            )
        } catch (e: AttestationException) { // <-- 라이브러리의 특정 예외를 캐치
            // Attestation 검증 자체에서 발생한 오류
            logger.error("App attestation validation failed: ${e.message}", e)
            return IntegrityVerificationResponse(
                isValid = false,
                message = "App attestation validation failed: ${e.message}",
                details = mapOf("errorType" to e.javaClass.simpleName, "validationError" to (e.message ?: "unknown")) // 예외 메시지 포함
            )
        } catch (e: Exception) { // 그 외 예상치 못한 다른 오류
            logger.error("Unexpected error during iOS app attestation verification", e)
            return IntegrityVerificationResponse(
                isValid = false,
                message = "Unexpected error verifying iOS attestation: ${e.localizedMessage ?: e.message}",
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
