package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.LuckyVickyStatus
import kr.ac.kookmin.wuung.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import java.time.LocalDateTime
import kr.ac.kookmin.wuung.model.Record

@Repository
interface RecordRepository : JpaRepository<Record, String>{
    fun findByUserAndCreatedAtBetween(
        user: User,
        start: LocalDateTime,
        end: LocalDateTime
    ): List<Record>
    fun findRecordsByStatus(status: LuckyVickyStatus, page: Pageable): Page<Record>
}