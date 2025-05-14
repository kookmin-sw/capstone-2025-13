package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.IntegrityChallenge
import kr.ac.kookmin.wuung.model.IntegrityChallengeStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.Optional

@Repository
interface IntegrityChallengeRepository : JpaRepository<IntegrityChallenge, String> {
    fun findByChallenge(challenge: String): Optional<IntegrityChallenge>
    fun findByDeviceIdAndStatus(deviceId: String, status: IntegrityChallengeStatus): List<IntegrityChallenge>
    fun findByExpiresAtBeforeAndStatus(instant: LocalDateTime, status: IntegrityChallengeStatus): List<IntegrityChallenge>

    @Transactional
    @Modifying
    fun deleteByExpiresAtBefore(instant: LocalDateTime)
}