package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.Diagnosis
import kr.ac.kookmin.wuung.model.DiagnosisType
import org.springframework.data.jpa.repository.JpaRepository

interface DiagnosisRepository : JpaRepository<Diagnosis, Long> {
    //fun findByToken(token: String, type : Long): List<Diagnosis>
}