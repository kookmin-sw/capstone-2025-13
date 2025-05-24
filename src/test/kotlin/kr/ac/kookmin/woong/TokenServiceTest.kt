package kr.ac.kookmin.wuung

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import kr.ac.kookmin.wuung.cron.RevokedTokenCleanupTask
import kr.ac.kookmin.wuung.repository.RevokedTokenRepository
import kr.ac.kookmin.wuung.service.RevokedTokenService
import java.time.LocalDateTime

@SpringBootTest
class TokenServiceTest {

    @Autowired
    private lateinit var tokenService: RevokedTokenService

    @Autowired
    private lateinit var revokedTokenRepository: RevokedTokenRepository

    @Test
    fun `revokeToken should add token to repository`() {
        val token = "example-token"

        tokenService.revokeToken(token)
        val isRevoked = tokenService.isTokenRevoked(token)

        assertThat(isRevoked).isTrue
    }

    @Test
    fun `deleteOldRevokedTokens should remove tokens older than 30 days`() {
        val token = "old-token"
        tokenService.revokeToken(token)

        // 강제로 30일 이전으로 설정
        val tokenEntity = revokedTokenRepository.findByToken(token).orElseThrow()
        revokedTokenRepository.save(tokenEntity.copy(revokedAt = LocalDateTime.now().minusDays(31)))

        // Cleanup 실행
        RevokedTokenCleanupTask(revokedTokenRepository).deleteOldRevokedTokens()

        val isStillExists = revokedTokenRepository.findByToken(token).isPresent
        assertThat(isStillExists).isFalse
    }

}