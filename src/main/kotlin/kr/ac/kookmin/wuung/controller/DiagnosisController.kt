package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import kr.ac.kookmin.wuung.exceptions.NotFoundException
import kr.ac.kookmin.wuung.exceptions.UnauthorizedException
import kr.ac.kookmin.wuung.jwt.JwtProvider
import kr.ac.kookmin.wuung.lib.ApiResponseDTO
import kr.ac.kookmin.wuung.model.Diagnosis
import kr.ac.kookmin.wuung.model.DiagnosisType
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.repository.DiagnosisRepository
import kr.ac.kookmin.wuung.service.DiagnosisService
import org.hibernate.annotations.NotFound
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import kotlin.jvm.optionals.getOrNull

data class CreateDiagnosisRequest(
    val result: Long,
    val type: String,
    val createAt: String
)

// message만 설정해놓긴 했음.
data class DiagnosisDTO(
    val id: Long,
    val type: DiagnosisType,
    val title: String,
    val description: String,
    val diagnosisQuestions: List<DiagnosisQuestionDTO> = listOf(),
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
data class DiagnosisQuestionDTO(
    val seq: Int,
    val text: String,
    val diagnosisText: List<DiagnosisTextDTO> = listOf()
)
data class DiagnosisTextDTO(
    val text: String,
    val score: Int,
)

fun Diagnosis.toDTO() = DiagnosisDTO(
    id = this.id ?: 0,
    type = this.type ?: DiagnosisType.Simple,
    title = this.title ?: "",
    description = this.description ?: "",
    createdAt = this.createdAt,
    updatedAt = this.updatedAt,
    diagnosisQuestions = this.diagnosisQuestions.map { question ->
        DiagnosisQuestionDTO(
            seq = question.seq ?: 0,
            text = question.text ?: "",
            diagnosisText = question.diagnosisText.map { text ->
                DiagnosisTextDTO(
                    text = text.text ?: "",
                    score = text.score,
                )
            }.sortedBy { it.score }
        )
    }.sortedBy { it.seq }
)

@RestController
@RequestMapping("/daignosis")
@Tag(name = "Diagnosis API", description = "Endpoints for Diagnosis create and read data")
class DiagnosisController(
    @Autowired private val diagnosisService: DiagnosisService,
    @Autowired private val jwtProvider: JwtProvider,
    private val diagnosisRepository: DiagnosisRepository
)
{
    /*
    @PostMapping("/")
    @Operation()
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully create diagnosis", useReturnTypeSchema = true),
            ApiResponse(responseCode = "400", description = "Failed to create diagnosis",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = ApiResponseDTO::class))]),
            ApiResponse(responseCode = "403", description = "Exception raised while create diagnosis",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = ApiResponseDTO::class))])
    ]
    )
    fun createDiagnosis(
        @RequestBody request: CreateDiagnosisRequest,
        @AuthenticationPrincipal userDetails: User?,
    ): ResponseEntity<ApiResponseDTO<DiagnosisDTO>> {
        // JWT 토큰 검증
        if (userDetails == null)
            throw UnauthorizedException()

        // 검사 형식 검증
        val isValidType = DiagnosisType.entries.any { it.name == request.type }
        if (!isValidType) throw NotFoundException()

        // 날짜 파싱 (형식: yyyy-MM-dd HH:mm:ss)
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
        val createdAt: LocalDateTime = try {
            LocalDateTime.parse(request.createAt, formatter)
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(
                ApiResponseDTO(data = )
            )
        }

        // 데이터 추가
        // diagnosisService.createDiagnosis(request.type, request.result, createdAt)
        // service method deleted...

        // 결과 반환
        return ResponseEntity.ok(CreateDiagnosisResponse("ok"))
    }
     */

    @GetMapping("/{id}")
    @Operation()
    @ApiResponses(
    )
    fun getDiagnosis(
        @AuthenticationPrincipal userDetails: User?,
        @PathVariable id: Int,
    ): ResponseEntity<ApiResponseDTO<DiagnosisDTO>> {
        // JWT 토큰 검증
        if (userDetails == null)
            throw UnauthorizedException()

        val diagnosis = diagnosisRepository.findDiagnosisById(id.toLong()).getOrNull()

        if (diagnosis == null) throw NotFoundException()

        return ResponseEntity.ok(
            ApiResponseDTO(data = diagnosis.toDTO())
        )
    }
}
