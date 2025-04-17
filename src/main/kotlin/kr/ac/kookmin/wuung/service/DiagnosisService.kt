package kr.ac.kookmin.wuung.service

import jakarta.transaction.Transactional
import kr.ac.kookmin.wuung.model.Diagnosis
import kr.ac.kookmin.wuung.model.DiagnosisType
import kr.ac.kookmin.wuung.repository.DiagnosisRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class DiagnosisService(
    @Autowired val diagnosisRepository : DiagnosisRepository
) {
    /*fun findByToken(token: String, type : Long): List<Diagnosis> {
        return diagnosisRepository.findByToken(token, type)
    }*/

    @Transactional
    fun createDiagnosis(type : String, result : Long, createAt : LocalDateTime): Diagnosis {
        val diagnosis = Diagnosis(
            type = type,
            result = result,
            createAt = createAt
        )

        return diagnosisRepository.save(diagnosis)
    }
}