package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Hidden
import kr.ac.kookmin.wuung.service.IntegrityChallengeService
import kr.ac.kookmin.wuung.service.IntegrityService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

data class ChallengeRequest(
    val deviceId: String
)

data class ChallengeResponse(
    val challenge: String,
    val expiresInMinutes: Long,
    val message: String,
)

data class IntegrityVerificationRequest(
    val platform: String,
    val attestation: String,
    val bundleId: String? = null,
    val challenge: String,
    val deviceId: String,
    val keyId: String? = null
)

data class IntegrityVerificationResponse(
    val isValid: Boolean,
    val message: String,
    val details: Map<String, Any>? = null
)

@RestController
@RequestMapping("/api/integrity")
@Hidden
class IntegrityController(
    @Autowired private val integrityService: IntegrityService,
    @Autowired private val challengeService: IntegrityChallengeService,
    private val integrityChallengeService: IntegrityChallengeService
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/challenge")
    fun getChallenge(
        @Valid @RequestBody request: ChallengeRequest
    ): ResponseEntity<ChallengeResponse> {
        try {
        val challenge = challengeService.generateChallenge(request.deviceId)
            return ResponseEntity.ok(
                ChallengeResponse(
                    challenge = challenge.first ?: "",
                    expiresInMinutes = challenge.second,
                    message = ""
                )
            )
        } catch(e: Exception) {
            logger.error("Error on getting challenge: ${e.message}")
            logger.debug(e.stackTraceToString())
            return ResponseEntity.ok(
                ChallengeResponse(
                    challenge = "",
                    expiresInMinutes = 0,
                    message = "An error occurred while generating challenge. Please try again later."
                )
            )
        }
    }

    @Transactional(timeout = 20)
    @PostMapping("/verify")
    fun verifyIntegrity(
        @RequestBody request: IntegrityVerificationRequest
    ): ResponseEntity<IntegrityVerificationResponse> {
        val challengeErrors = challengeService.verifyChallenge(request.challenge, request.deviceId)
        if(challengeErrors != null) return ResponseEntity.ok(challengeErrors)

        try {
            val result = when (request.platform.lowercase()) {
                "android" -> integrityService.verifyAndroidIntegrity(request.attestation, request.challenge)
                "ios" -> integrityService.verifyIosAppAttest(
                    request.attestation,
                    request.keyId ?: "",
                    request.challenge
                )

                else -> IntegrityVerificationResponse(
                    isValid = false,
                    message = "Unsupported platform: ${request.platform}"
                )
            }

            integrityChallengeService.completeChallenge(request.challenge)
            return ResponseEntity.ok(result)
        } catch(e: Exception) {
            logger.error("Error on verifying integrity: ${e.message}")
            logger.debug(e.stackTraceToString())
            return ResponseEntity.ok(
                IntegrityVerificationResponse(
                    isValid = false,
                    message = "An error occurred while verifying integrity. Please try again later."
                )
            )
        }
    }
}