package kr.ac.kookmin.wuung.service

import kr.ac.kookmin.wuung.controller.ChallengeResponse
import kr.ac.kookmin.wuung.controller.IntegrityVerificationResponse
import kr.ac.kookmin.wuung.model.IntegrityChallenge
import kr.ac.kookmin.wuung.model.IntegrityChallengeStatus
import kr.ac.kookmin.wuung.repository.IntegrityChallengeRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import java.util.Base64
import kotlin.jvm.optionals.getOrNull

@Service
class IntegrityChallengeService(
    @Autowired private val challengeRepository: IntegrityChallengeRepository,
    @Value("\${app.integrity-challenge-exp:15}") private val challengeExp: Int
) {
    private val logger = LoggerFactory.getLogger(this::class.java)
    private val secureRandom = SecureRandom()

    fun generateChallenge(deviceId: String): Pair<String?, Long> {
       val pendingChallenges = challengeRepository.findByDeviceIdAndStatus(
           deviceId,
           IntegrityChallengeStatus.PENDING
       )

        if(pendingChallenges.isNotEmpty()) {
            val latestChallenge = pendingChallenges.maxByOrNull { it.createdAt }

            if (latestChallenge != null && latestChallenge.expiresAt?.isAfter(LocalDateTime.now()) == true) {
                logger.info("Challenge already exists for device: $deviceId")
                return Pair(latestChallenge.challenge, ChronoUnit.MINUTES.between(LocalDateTime.now(), latestChallenge.expiresAt))
            }
        }

        val bytes = ByteArray(32)
        secureRandom.nextBytes(bytes)

        val challenge = Base64.getEncoder()
            .encodeToString(bytes)
        val expiresAt = LocalDateTime.now().plusMinutes(challengeExp.toLong())

        val integrityChallenge = IntegrityChallenge(
            challenge = challenge,
            deviceId = deviceId,
            expiresAt = expiresAt,
        )

        challengeRepository.save(integrityChallenge)
        logger.info("Generated new integrity challenge for device: $deviceId, expiresAT: $expiresAt")
        return Pair(challenge, ChronoUnit.MINUTES.between(LocalDateTime.now(), expiresAt))
    }

    fun verifyChallenge(challenge: String, deviceId: String): IntegrityVerificationResponse? {
        val challengeOpt = challengeRepository.findByChallenge(challenge).getOrNull()

        if (challengeOpt == null) {
            logger.info("Challenge not found for device: $deviceId")
            return IntegrityVerificationResponse(false, "Challenge not found")
        }

        if (challengeOpt.deviceId != deviceId) {
            logger.info("Device ID mismatch for challenge: $challenge, expected: $deviceId, actual: ${challengeOpt.deviceId}")
            return IntegrityVerificationResponse(false,"Device ID mismatch")
        }

        val currentTime = LocalDateTime.now()
        challengeOpt.expiresAt?.let {
            if (it.isBefore(currentTime)) {
                challengeOpt.status = IntegrityChallengeStatus.EXPIRED
                challengeRepository.save(challengeOpt)
                logger.info("Challenge expired: $challenge")
                return IntegrityVerificationResponse(false,"Challenge expired")
            }
        }

        return when (challengeOpt.status) {
            IntegrityChallengeStatus.COMPLETED -> IntegrityVerificationResponse(false, "Challenge already used")
            IntegrityChallengeStatus.EXPIRED -> IntegrityVerificationResponse(false, "Challenge expired")
            else -> null
        }
    }

    fun completeChallenge(challenge: String): Boolean {
        val challengeOpt = challengeRepository.findByChallenge(challenge).getOrNull()

        if(challengeOpt == null) {
            return false
        }

        challengeOpt.status = IntegrityChallengeStatus.COMPLETED
        challengeRepository.save(challengeOpt)
        logger.info("Challenge completed: $challenge")

        return true
    }
}