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
import kr.ac.kookmin.wuung.lib.datetimeParser
import kr.ac.kookmin.wuung.model.Diagnosis
import kr.ac.kookmin.wuung.model.DiagnosisResults
import kr.ac.kookmin.wuung.model.DiagnosisType
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.repository.DiagnosisRepository
import kr.ac.kookmin.wuung.repository.DiagnosisResultsRepository
import kr.ac.kookmin.wuung.service.DiagnosisService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
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
    val questions: List<DiagnosisQuestionDTO> = listOf(),
    val scale: List<DiagnosisScaleDTO> = listOf(),
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
data class DiagnosisQuestionDTO(
    val seq: Int,
    val text: String,
    val answers: List<DiagnosisTextDTO> = listOf()
)
data class DiagnosisTextDTO(
    val text: String,
    val score: Int,
)
data class DiagnosisScaleDTO(
    val start: Int,
    val scaleName: String,
    val description: String,
)

fun Diagnosis.toDTO() = DiagnosisDTO(
    id = this.id ?: 0,
    type = this.type ?: DiagnosisType.Simple,
    title = this.title ?: "",
    description = this.description ?: "",
    createdAt = this.createdAt,
    updatedAt = this.updatedAt,
    questions = this.diagnosisQuestions.map { question ->
        DiagnosisQuestionDTO(
            seq = question.seq ?: 0,
            text = question.text ?: "",
            answers = question.diagnosisText.map { text ->
                DiagnosisTextDTO(
                    text = text.text ?: "",
                    score = text.score,
                )
            }.sortedBy { it.score }
        )
    }.sortedBy { it.seq },
    scale = this.diagnosisScale.map { scale ->
        DiagnosisScaleDTO(
            start = scale.start,
            scaleName = scale.scaleName ?: "",
            description = scale.description ?: "",
        )
    }.sortedBy { it.start },
)
fun Diagnosis.toDTOSelf() = DiagnosisDTO(
    id = this.id ?: 0,
    type = this.type ?: DiagnosisType.Simple,
    title = this.title ?: "",
    description = this.description ?: "",
    createdAt = this.createdAt,
    updatedAt = this.updatedAt,
    questions = listOf(),
    scale = this.diagnosisScale.map { scale ->
        DiagnosisScaleDTO(
            start = scale.start,
            scaleName = scale.scaleName ?: "",
            description = scale.description ?: "",
        )
    }.sortedBy { it.start },
)

data class DiagnosisResultSubmitRequest(
    val id: Long,
    val result: Int,
    val scale: Int,
)

data class DiagnosisResultDTO(
    val id: String,
    val diagnosisId: Long,
    val result: Int,
    val scale: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)
fun DiagnosisResults.toDTO() = DiagnosisResultDTO(
    id = this.id ?: "",
    diagnosisId = this.diagnosis?.id ?: 0,
    result = this.result ?: 0,
    scale = this.scale ?: 0,
    createdAt = this.createdAt,
    updatedAt = this.updatedAt
)

@RestController
@RequestMapping("/diagnosis")
@Tag(name = "Diagnosis API", description = """
    [EN] Endpoints for Diagnosis create and read data.
    AccessToken is required for all of this part of endpoints on Authorization header.
    
    [KR] 진단 생성 및 읽기를 위한 엔드포인트입니다.
    모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.
""")
class DiagnosisController(
    @Autowired private val diagnosisService: DiagnosisService,
    @Autowired private val jwtProvider: JwtProvider,
    private val diagnosisRepository: DiagnosisRepository,
    private val diagnosisResultsRepository: DiagnosisResultsRepository
)  {
    @GetMapping("/{id}")
    @Operation(
        summary = "Get diagnosis by ID / ID로 진단 조회",
        description = """
            [EN] Retrieve diagnosis details for the specified ID.
            AccessToken is required for this part of endpoints on Authorization header.
            
            [KR] 지정된 ID의 진단 상세 정보를 조회합니다.
            이 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully retrieved diagnosis",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "401",
                description = "Unauthorized - Invalid or missing JWT token",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Diagnosis not found",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
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

    @GetMapping("/list")
    @Operation(
        summary = "Get all diagnosis list / 전체 진단 목록 조회",
        description = """
            [EN] Retrieve a list of all available diagnoses.
            AccessToken is required for this part of endpoints on Authorization header.
            
            [KR] 사용 가능한 모든 진단 목록을 조회합니다.
            이 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully retrieved diagnosis list",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "401",
                description = "Unauthorized - Invalid or missing JWT token",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun getDiagnosisList(
        @AuthenticationPrincipal userDetails: User?,
    ): ResponseEntity<ApiResponseDTO<List<DiagnosisDTO>>> {
        if (userDetails == null) throw UnauthorizedException()

        val diagnosisList = diagnosisRepository.findAll().map { it.toDTOSelf() }

        return ResponseEntity.ok(
            ApiResponseDTO(data = diagnosisList)
        )
    }

    @PutMapping("/submit")
    @Operation(
        summary = "Submit diagnosis result / 진단 결과 제출",
        description = """
            [EN] Submit a new diagnosis result for the authenticated user.
            AccessToken is required for this part of endpoints on Authorization header.
            
            [KR] 인증된 사용자의 새로운 진단 결과를 제출합니다.
            이 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully submitted diagnosis result",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "401",
                description = "Unauthorized - Invalid or missing JWT token",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Diagnosis not found",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun putDiagnosis(
        @AuthenticationPrincipal userDetails: User?,
        @RequestBody request: DiagnosisResultSubmitRequest,
    ): ResponseEntity<ApiResponseDTO<DiagnosisResultDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val diagnosis = diagnosisRepository.findDiagnosisById(request.id).getOrNull()
        if (diagnosis == null) throw NotFoundException()

        val diagnosisResult = DiagnosisResults(
            user = userDetails,
            diagnosis = diagnosis,
            result = request.result,
            scale = request.scale
        )

        diagnosisResultsRepository.save(diagnosisResult)

        return ResponseEntity.ok(
            ApiResponseDTO(data = diagnosisResult.toDTO())
        )
    }

    @GetMapping("/results")
    @Operation(
        summary = "Get diagnosis results / 진단 결과 조회",
        description = """
            [EN] Retrieve diagnosis results for the authenticated user with optional date filtering.
            AccessToken is required for this part of endpoints on Authorization header.
            
            [KR] 인증된 사용자의 진단 결과를 조회합니다. 선택적으로 날짜 필터링이 가능합니다.
            이 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully retrieved diagnosis results",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "401",
                description = "Unauthorized - Invalid or missing JWT token",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun getDiagnosisResults(
        @AuthenticationPrincipal userDetails: User?,
        @Schema(description = "Start date in format yyyy-MM-dd", example = "2000-01-01")
        @RequestParam(required = false) start: String?,
    ): ResponseEntity<ApiResponseDTO<List<DiagnosisResultDTO>>> {
        if (userDetails == null) throw UnauthorizedException()

        val diagnosis = start?.let {
            val startDate = start.datetimeParser()
            diagnosisResultsRepository.findByUserAndCreatedAtAfter(userDetails, startDate)
        } ?: diagnosisResultsRepository.findByUser(userDetails)

        return ResponseEntity.ok(
            ApiResponseDTO(data = diagnosis.map { it.toDTO() }.sortedByDescending { it.createdAt } )
        )
    }
}
