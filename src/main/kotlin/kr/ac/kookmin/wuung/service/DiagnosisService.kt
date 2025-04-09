package kr.ac.kookmin.wuung.service

import kr.ac.kookmin.wuung.model.Diagnosis
import kr.ac.kookmin.wuung.model.DiagnosisType
import kr.ac.kookmin.wuung.repository.DiagnosisRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

@Service
class DiagnosisService(
    @Autowired val diagnosisRepository : DiagnosisRepository
) {
    fun findAllByTokenWithType(token: String, type : Long): List<Diagnosis> {
        return diagnosisRepository.findAllByTokenWithType(token, type)
    }
}