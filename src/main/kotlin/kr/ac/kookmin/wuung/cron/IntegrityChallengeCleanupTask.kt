package kr.ac.kookmin.wuung.cron

import kr.ac.kookmin.wuung.model.IntegrityChallengeStatus
import kr.ac.kookmin.wuung.repository.IntegrityChallengeRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class IntegrityChallengeCleanupTask(
    @Autowired private val integrityChallengeRepository: IntegrityChallengeRepository
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @Scheduled(cron = "0 */10 * * * ?")
    fun cleanupExpiredChallenges() {
        val now = LocalDateTime.now()
        logger.info("Cleaning up expired integrity challenges...")

        val expiredChallenges = integrityChallengeRepository.findByExpiresAtBeforeAndStatus(
            now,
            IntegrityChallengeStatus.PENDING
        )

        expiredChallenges.forEach {
            it.status = IntegrityChallengeStatus.EXPIRED
        }

        if (expiredChallenges.isNotEmpty()) {
            integrityChallengeRepository.saveAll(expiredChallenges)
            logger.info("Cleaned up ${expiredChallenges.size} expired integrity challenges")
        }

        val twoDaysAgo = LocalDateTime.now().minusDays(2)
        integrityChallengeRepository.deleteByExpiresAtBefore(twoDaysAgo)
    }
}