package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Hidden
import kr.ac.kookmin.wuung.service.IntegrityChallengeService
import kr.ac.kookmin.wuung.service.IntegrityService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
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

@RestController("/api/integrity")
@Hidden
class IntegrityController(
    @Autowired private val integrityService: IntegrityService,
    @Autowired private val challengeService: IntegrityChallengeService
) {
    @PostMapping("/challenge")
    fun getChallenge(
        @Valid @RequestBody request: ChallengeRequest
    ): ResponseEntity<ChallengeResponse> {
        val challenge = challengeService.generateChallenge(request.deviceId)
        return ResponseEntity.ok(
            ChallengeResponse(
                challenge = challenge.first,
                expiresInMinutes = challenge.second
            )
        )
    }

    @PostMapping("/verify")
    fun verifyIntegrity(
        @Valid @RequestBody request: IntegrityVerificationRequest
    ): ResponseEntity<IntegrityVerificationResponse> {
        if(!challengeService.verifyChallenge(request.challenge, request.deviceId)) {
            return ResponseEntity.ok(
                IntegrityVerificationResponse(
                    isValid = false,
                    message = "Invalid or expired challenge. Please request a new challenge and try again."
                )
            )
        }

        val result = when (request.platform.lowercase()) {
            "android" -> integrityService.verifyAndroidIntegrity(request.attestation)
            "ios" -> integrityService.verifyIosAppAttest(
                request.attestation,
                request.bundleId ?: "",
                request.challenge ?: ""
            )
            else -> IntegrityVerificationResponse(isValid = false, message = "Unsupported platform: ${request.platform}")
        }

        return ResponseEntity.ok(result)
    }
}