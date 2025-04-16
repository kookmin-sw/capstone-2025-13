package kr.ac.kookmin.wuung.service

import kr.ac.kookmin.wuung.repository.DiagnosisTextRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import kr.ac.kookmin.wuung.model.DiagnosisText

@Service
class DiagnosisTextService(
    @Autowired val diagnosisTextRepository : DiagnosisTextRepository
) {
    fun getDiagnosisTextStrings(type: String): List<String> {
        val diagnosisTexts: List<DiagnosisText> = diagnosisTextRepository.findAllByType(type)
        // 검사 텍스트가 null일 수 있으므로 mapNotNull 사용하여 안전하게 추출합니다.
        return diagnosisTexts.mapNotNull { it.text }
    }
}