package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import kr.ac.kookmin.wuung.model.Record
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.media.Content
import org.springframework.security.core.annotation.AuthenticationPrincipal
import io.swagger.v3.oas.annotations.media.Schema
import kr.ac.kookmin.wuung.exceptions.*
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.http.ResponseEntity
import kr.ac.kookmin.wuung.lib.ApiResponseDTO
import kr.ac.kookmin.wuung.repository.RecordRepository
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.exceptions.NotFoundException
import kr.ac.kookmin.wuung.exceptions.UnauthorizedException
import kr.ac.kookmin.wuung.lib.datetimeParser
import kr.ac.kookmin.wuung.model.RecordFeedback
import kr.ac.kookmin.wuung.model.RecordFeedbackStatus
import kr.ac.kookmin.wuung.repository.RecordFeedbackRepository
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import java.time.LocalDate
import kotlin.collections.map
import kotlin.jvm.optionals.getOrNull

data class RecordDTO(
    val id: Long,
    val rate: Int,
    val data: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

fun Record.toDTO() = RecordDTO(
    this.id ?: 0,
    this.rate ?: 0,
    this.data ?: "",
    this.createdAt,
    this.updatedAt
)

data class CreateRecordRequest(
    val rate: Int,
    val data: String
)


data class RecordFeedbackRequest(
    val data: String
)

data class RecordUpdateRequest(
    val id: Long,
    val rate: Int,
    val data: String,
)

data class RecordFeedbackDTO(
    val id: String?,
    val aiFeedback: String?,
    val comment: String?,
    val data: String?,
    val status: RecordFeedbackStatus,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class UpdateFeedbackRequest(
    val data: String,
    val comment: String
)

@RestController
@RequestMapping("/record")
@Tag(name = "Record API", description = "Endpoints for record, feedback record")
class RecordController(
    @Autowired private val recordRepository: RecordRepository,
    @Autowired private val recordFeedbackRepository: RecordFeedbackRepository
) {
    @GetMapping("/me")
    @Operation(summary = "Get record information for a specific date", description = "Get record id, data, rate, ...")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Get record successfully",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "401", description = "Unauthorized",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "404", description = "Record not found",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun getRecordByDate(
        @AuthenticationPrincipal userDetails: User?,
        @Schema(description = "Date in format yyyy-MM-dd", example = "2025-05-01")
        @RequestParam date: String
    ): ResponseEntity<ApiResponseDTO<RecordDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        // 요청된 날짜의 시작·끝 시각 계산
        val targetDate: LocalDate = date.datetimeParser().toLocalDate()
        val startOfDay: LocalDateTime = targetDate.atStartOfDay()
        val endOfDay: LocalDateTime = targetDate.atTime(23, 59, 59)

        // JPA 메서드로 날짜 범위 내 레코드 조회
        val records: List<Record> = recordRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startOfDay,
            endOfDay
        )

        if (records.isEmpty()) {
            throw NotFoundException()
        }

        // 가장 최신 생성 레코드 선택
        val record = records.maxByOrNull { it.createdAt } ?: throw NotFoundException()

        return ResponseEntity.ok(ApiResponseDTO(data = record.toDTO()))
    }

    @PutMapping("/create")
    @Operation(summary = "Create new record", description = """
        Create a new record with rate and data.
        AccessToken is required for all of this part of endpoints on Authorization header.
    """)
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Create record successfully",
                useReturnTypeSchema = true,
            ),
            ApiResponse(
                responseCode = "401", description = "Unauthorized",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "409", description = "Record already created",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun createRecord(
        @AuthenticationPrincipal userDetails: User?,
        @RequestBody request: CreateRecordRequest,
    ): ResponseEntity<ApiResponseDTO<RecordDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val today = LocalDate.now()
        val startOfDay = today.atStartOfDay()
        val endOfDay = today.atTime(23, 59, 59)

        // 레코드 하루에 한 개 이상 생성하는 거 방지하려고 추가
        val existingRecords = recordRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startOfDay,
            endOfDay
        )
        if (existingRecords.isNotEmpty()) throw RecordAlreadyCreatedException()

        val record = Record(
            rate = request.rate,
            data = request.data,
            user = userDetails
        )
        val saved = recordRepository.save(record)
        return ResponseEntity.ok(ApiResponseDTO(data = saved.toDTO()))
    }

    @PostMapping("/modify")
    @Operation(
        summary = "Modify existing record information",
        description = "Update rate and data of an existing record"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Update record successfully",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "401", description = "Unauthorized",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "404", description = "Record not found",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun modifyRecord(
        @AuthenticationPrincipal userDetails: User?,
        @RequestBody request: RecordUpdateRequest
    ): ResponseEntity<ApiResponseDTO<RecordDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val record = recordRepository.findById(request.id).getOrNull() ?: throw NotFoundException()
        if (record.user?.id != userDetails.id) throw UnauthorizedException()

        record.rate = request.rate
        record.data = request.data
        // updatedAt은 @PreUpdate로 자동 갱신

        val updated = recordRepository.save(record)
        return ResponseEntity.ok(ApiResponseDTO(data = updated.toDTO()))
    }

    @PutMapping("/feedback")
    @Operation(summary = "Create new feedback record", description = "Create new empty feedback record for a record")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Create feedback record successfully",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "401", description = "Unauthorized",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "404", description = "Record not found",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun createFeedback(
        @AuthenticationPrincipal userDetails: User?,
        @RequestParam recordId: Long
    ): ResponseEntity<ApiResponseDTO<String>> {
        if (userDetails == null) throw UnauthorizedException()
        val record = recordRepository.findById(recordId).getOrNull() ?: throw NotFoundException()
        val feedback = RecordFeedback(record = record)
        val saved = recordFeedbackRepository.save(feedback)
        return ResponseEntity.ok(ApiResponseDTO(data = saved.id))
    }

    @PutMapping("/feedback/{id}")
    @Operation(summary = "Request AI feedback", description = "Request AI feedback using record")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Feedback request successfully",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "401", description = "Unauthorized",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "404", description = "Feedback record not found",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "409", description = "AI feedback is still processing",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "412", description = "AI feedback already completed",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "500", description = "AI feedback processing error",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun updateFeedbackStatus(
        @AuthenticationPrincipal userDetails: User?,
        @RequestParam id: String,
        @RequestBody request: RecordFeedbackRequest
    ): ResponseEntity<ApiResponseDTO<String>> {
        if (userDetails == null) throw UnauthorizedException()

        val feedback = recordFeedbackRepository.findById(id).getOrNull() ?: throw NotFoundException()

        // NullPointerException or IllegalArgumentException could trigger ServletException
        if (id.isBlank() || request.data.isBlank()) {
            throw IllegalArgumentException()
        }

        when (feedback.status) {
            RecordFeedbackStatus.QUEUED -> Unit
            RecordFeedbackStatus.PROCESSING -> throw AiFeedbackNotCompleteException()
            RecordFeedbackStatus.PROCESSING_ERROR -> throw AiFeedbackErrorException()
            RecordFeedbackStatus.COMPLETED -> throw AiFeedbackDuplicatedException()
        }

        feedback.status = RecordFeedbackStatus.PROCESSING
        try {
            recordFeedbackRepository.save(feedback)
        } catch (e: Exception) {
            // Database errors could trigger ServletException
            throw ServerErrorException()
        }

        // 레코드 테이블의 유져 id나 아니면 사용자 엑세스토큰 조회해서 차감하는 로직만들면 될 것 같고

        // request body에 피드백 원하는 내용 담을 수 있도록 만들어놨으니까 그거 이용해서 AI 피드백 받으면 될 듯?

        return ResponseEntity.ok(ApiResponseDTO())
    }

    @GetMapping("/feedback")
    @Operation(summary = "Get all feedback record", description = "Get all feedback that ai feedback completed")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Get feedback records successfully",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "401", description = "Unauthorized",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "404", description = "Record not found",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun getFeedbacks(
        @AuthenticationPrincipal userDetails: User?,
        @RequestParam recordId: Long
    ): ResponseEntity<ApiResponseDTO<List<RecordFeedbackDTO>>> {

        if (userDetails == null) throw UnauthorizedException()
        val record = recordRepository.findById(recordId).getOrNull() ?: throw NotFoundException()

        val feedbacks = recordFeedbackRepository.findRecordFeedbackByRecord(record)
            .filter { it.status == RecordFeedbackStatus.COMPLETED }
        return ResponseEntity.ok(ApiResponseDTO(data = feedbacks.map {
            RecordFeedbackDTO(
                id = it.id,
                aiFeedback = it.aiFeedback,
                comment = it.comment,
                data = it.data,
                status = it.status,
                createdAt = it.createdAt,
                updatedAt = it.updatedAt
            )
        }))
    }

    @GetMapping("/feedback/{id}")
    @Operation(summary = "Get feedback record", description = "Get feedback details by feedback record ID")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Get feedback record successfully",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "401", description = "Unauthorized",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "404", description = "Feedback record not found",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "409", description = "AI feedback is still processing",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "500", description = "AI feedback processing error",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun getFeedback(
        @AuthenticationPrincipal userDetails: User?,
        @PathVariable id: String
    ): ResponseEntity<ApiResponseDTO<RecordFeedbackDTO>> {

        if (userDetails == null) throw UnauthorizedException()
        val feedback = recordFeedbackRepository.findById(id).getOrNull() ?: throw NotFoundException()

        when (feedback.status) {
            RecordFeedbackStatus.QUEUED -> Unit
            RecordFeedbackStatus.PROCESSING -> throw AiFeedbackNotCompleteException()
            RecordFeedbackStatus.PROCESSING_ERROR -> throw AiFeedbackErrorException()
            RecordFeedbackStatus.COMPLETED -> Unit
        }

        return ResponseEntity.ok(
            ApiResponseDTO(
                data = RecordFeedbackDTO(
                    id = feedback.id,
                    aiFeedback = feedback.aiFeedback,
                    comment = feedback.comment,
                    data = feedback.data,
                    status = feedback.status,
                    createdAt = feedback.createdAt,
                    updatedAt = feedback.updatedAt
                )
            )
        )
    }


    @PostMapping("/feedback/{id}")
    @Operation(summary = "Update feedback record", description = "Update feedback record data and comment")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Update feedback successfully",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "401", description = "Unauthorized",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "404", description = "Feedback record not found",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "409", description = "AI feedback is still processing",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "500", description = "AI feedback processing error",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun updateFeedback(
        @AuthenticationPrincipal userDetails: User?,
        @PathVariable id: String,
        @RequestBody request: UpdateFeedbackRequest
    ): ResponseEntity<ApiResponseDTO<String>> {

        if (userDetails == null) throw UnauthorizedException()
        val feedback = recordFeedbackRepository.findById(id).getOrNull() ?: throw NotFoundException()

        when (feedback.status) {
            RecordFeedbackStatus.QUEUED -> throw AiFeedbackNotCompleteException()
            RecordFeedbackStatus.PROCESSING -> throw AiFeedbackNotCompleteException()
            RecordFeedbackStatus.PROCESSING_ERROR -> throw AiFeedbackErrorException()
            RecordFeedbackStatus.COMPLETED -> Unit
        

        // 데이터 업데이트
        feedback.data = request.data
        feedback.comment = request.comment
        val updated = recordFeedbackRepository.save(feedback)

        return ResponseEntity.ok(ApiResponseDTO())

    }
}