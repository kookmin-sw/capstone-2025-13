package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.DiagnosisText
import kr.ac.kookmin.wuung.model.DiagnosisType
import org.springframework.data.jpa.repository.JpaRepository

interface DiagnosisTextRepository : JpaRepository<DiagnosisText, Long>{
    fun findAllByType(type: String): List<DiagnosisText>
}