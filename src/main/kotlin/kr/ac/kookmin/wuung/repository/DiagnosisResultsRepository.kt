package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.DiagnosisResults
import kr.ac.kookmin.wuung.model.User
import org.springframework.data.jpa.repository.JpaRepository
import java.lang.String
import java.time.LocalDateTime

interface DiagnosisResultsRepository : JpaRepository<DiagnosisResults, String> {
    fun findByUser(user: User): List<DiagnosisResults>
    fun findByUserAndCreatedAtAfter(user: User, createdAt: LocalDateTime): List<DiagnosisResults>
    fun findByUserAndCreatedAt(user: User, createdAt: LocalDateTime): List<DiagnosisResults>
}