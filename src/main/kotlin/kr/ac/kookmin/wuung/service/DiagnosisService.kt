package kr.ac.kookmin.wuung.service

import com.fasterxml.jackson.annotation.JsonProperty
import kr.ac.kookmin.wuung.model.Diagnosis
import kr.ac.kookmin.wuung.model.DiagnosisType
import kr.ac.kookmin.wuung.repository.DiagnosisRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.io.Serializable
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrNull


data class DiagnosisDTO(
    val id: Long,
    val type: DiagnosisType,
    val title: String,
    val description: String,
    val questions: List<DiagnosisQuestionDTO> = listOf(),
    val scale: List<DiagnosisScaleDTO> = listOf(),
    @JsonProperty("max_score")
    val maxScore: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
): Serializable
data class DiagnosisQuestionDTO(
    val seq: Int,
    val text: String,
    val answers: List<DiagnosisTextDTO> = listOf()
): Serializable
data class DiagnosisTextDTO(
    val text: String,
    val score: Int,
): Serializable
data class DiagnosisScaleDTO(
    val start: Int,
    val scaleName: String,
    val description: String,
): Serializable

fun Diagnosis.toDTO() = DiagnosisDTO(
    id = this.id ?: 0,
    type = this.type,
    title = this.title,
    description = this.description,
    maxScore = this.totalScore,
    createdAt = this.createdAt,
    updatedAt = this.updatedAt,
    questions = this.diagnosisQuestions.map { question ->
        DiagnosisQuestionDTO(
            seq = question.seq,
            text = question.text,
            answers = question.diagnosisText.map { text ->
                DiagnosisTextDTO(
                    text = text.text,
                    score = text.score,
                )
            }.sortedBy { it.score }
        )
    }.sortedBy { it.seq },
    scale = this.diagnosisScale.map { scale ->
        DiagnosisScaleDTO(
            start = scale.start,
            scaleName = scale.scaleName,
            description = scale.description,
        )
    }.sortedBy { it.start },
)
fun Diagnosis.toDTOSelf() = DiagnosisDTO(
    id = this.id ?: 0,
    type = this.type,
    title = this.title,
    description = this.description,
    createdAt = this.createdAt,
    updatedAt = this.updatedAt,
    questions = listOf(),
    maxScore = this.totalScore,
    scale = this.diagnosisScale.map { scale ->
        DiagnosisScaleDTO(
            start = scale.start,
            scaleName = scale.scaleName,
            description = scale.description,
        )
    }.sortedBy { it.start },
)

@Service
class DiagnosisService(
    @Autowired val diagnosisRepository : DiagnosisRepository
) {
    @Cacheable(
        value = ["diagnosis"],
        key = "'diagnosis_' + #id"
    )
    fun findById(id: Long) = diagnosisRepository.findDiagnosisById(id).getOrNull()?.toDTO()
    fun findByIdWithRaw(id: Long) = diagnosisRepository.findDiagnosisById(id).getOrNull()

    @Cacheable(
        value = ["diagnosis_list"],
        key = "'diagnosis_list'"
    )
    fun findAll() = diagnosisRepository.findAll().map { it.toDTOSelf() }
}