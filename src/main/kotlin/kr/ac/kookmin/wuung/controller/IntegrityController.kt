package kr.ac.kookmin.wuung.controller

import kr.ac.kookmin.wuung.service.IntegrityChallengeService
import kr.ac.kookmin.wuung.service.IntegrityService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
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
    val expiresInMinutes: Long
)

data class IntegrityVerificationRequest(
    val platform: String,
    val attestation: String,
    val bundleId: String? = null,
    val challenge: String,
    val deviceId: String
)

data class IntegrityVerificationResponse(
    val isValid: Boolean,
    val message: String,
    val details: Map<String, Any>? = null
)

@RestController
@RequestMapping("/api/integrity")
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
                    expiresInMinutes = challenge.second
                )
            )
        } catch(e: Exception) {
            logger.error("Error on getting challenge: ${e.message}")
            logger.debug(e.stackTraceToString())
            return ResponseEntity.ok(
                ChallengeResponse(
                    challenge = "",
                    expiresInMinutes = 0
                )
            )
        }
    }

    @PostMapping("/verify")
    fun verifyIntegrity(
        @RequestBody request: IntegrityVerificationRequest
    ): ResponseEntity<IntegrityVerificationResponse> {
        if(!challengeService.verifyChallenge(request.challenge, request.deviceId)) {
            return ResponseEntity.ok(
                IntegrityVerificationResponse(
                    isValid = false,
                    message = "Invalid or expired challenge. Please request a new challenge and try again."
                )
            )
        }

        try {
            val result = when (request.platform.lowercase()) {
                "android" -> integrityService.verifyAndroidIntegrity(request.attestation)
                "ios" -> integrityService.verifyIosAppAttest(
                    request.attestation,
                    request.bundleId ?: "",
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