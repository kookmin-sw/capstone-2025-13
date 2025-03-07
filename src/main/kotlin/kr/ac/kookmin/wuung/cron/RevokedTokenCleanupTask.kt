package kr.ac.kookmin.wuung.cron

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import kr.ac.kookmin.wuung.repository.RevokedTokenRepository
import java.time.LocalDateTime

@Component
class RevokedTokenCleanupTask(
    @Autowired
    private val revokedTokenRepository: RevokedTokenRepository
) {
    // 매일 자정(0시)에 실행
    @Scheduled(cron = "0 0 0 * * ?")
    fun deleteOldRevokedTokens() {
        val thirtyDaysAgo = LocalDateTime.now().minusDays(30)
        val oldTokens = revokedTokenRepository.findAll()
            .filter { it.revokedAt.isBefore(thirtyDaysAgo) }

        if (oldTokens.isNotEmpty()) {
            revokedTokenRepository.deleteAll(oldTokens)
        }
    }
}