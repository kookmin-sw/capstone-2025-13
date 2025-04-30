package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.Diagnosis
import kr.ac.kookmin.wuung.model.DiagnosisType
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface DiagnosisRepository : JpaRepository<Diagnosis, Long> {
    fun findDiagnosisById(id: Long): Optional<Diagnosis>
}