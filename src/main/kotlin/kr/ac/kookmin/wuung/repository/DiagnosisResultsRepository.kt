package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.DiagnosisResults
import kr.ac.kookmin.wuung.model.User
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDateTime
import java.util.Optional

interface DiagnosisResultsRepository : JpaRepository<DiagnosisResults, String> {
    override fun findById(id: String): Optional<DiagnosisResults>
    fun findByUser(user: User): List<DiagnosisResults>
    fun findByUserAndCreatedAtAfter(user: User, createdAt: LocalDateTime): List<DiagnosisResults>
    fun findByUserAndCreatedAtBetween(user: User, startTime: LocalDateTime, endTime:LocalDateTime): List<DiagnosisResults>
}