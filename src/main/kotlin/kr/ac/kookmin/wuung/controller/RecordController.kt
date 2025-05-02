package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import kr.ac.kookmin.wuung.model.Record
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.media.Content
import org.springframework.security.core.annotation.AuthenticationPrincipal
import io.swagger.v3.oas.annotations.media.Schema
import kr.ac.kookmin.wuung.exceptions.FeedBackProcessErrorException
import kr.ac.kookmin.wuung.exceptions.FeedBackProcessingException
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
    val rate : Int,
    val data : String
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
@RequestMapping("/records")
@Tag(name = "Record API", description = "Endpoints for records")
class RecordController(
    @Autowired private val authenticationManager: AuthenticationManager,
    @Autowired private val recordRepository : RecordRepository,
    @Autowired private val recordFeedbackRepository: RecordFeedbackRepository
) {
    @GetMapping("/me")
    @Operation(summary = "Get record by date", description = "Get a user's record for a specific date")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Successfully retrieved record",
            content = [Content(mediaType = "application/json", schema = Schema(implementation = ApiResponseDTO::class))]),
        ApiResponse(responseCode = "403", description = "Unauthorized",
            content = [Content(mediaType = "application/json", schema = Schema(implementation = ApiResponseDTO::class))]),
        ApiResponse(responseCode = "404", description = "Record not found",
            content = [Content(mediaType = "application/json", schema = Schema(implementation = ApiResponseDTO::class))])
    ])
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
    @Operation(summary = "Create new record", description = "Create a new record with rate and data")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully created record",
                useReturnTypeSchema = true,
            ),
            ApiResponse(
                responseCode = "403", description = "Unauthorized",
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

        val record = Record(
            rate = request.rate,
            data = request.data,
            user = userDetails
        )
        val saved = recordRepository.save(record)
        return ResponseEntity.ok(ApiResponseDTO(data = saved.toDTO()))
    }

    @PostMapping("/modify")
    @Operation(summary = "Modify existing record", description = "Update rate and data of an existing record")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Successfully updated record",
            content = [Content(mediaType = "application/json", schema = Schema(implementation = ApiResponseDTO::class))]),
        ApiResponse(responseCode = "403", description = "Unauthorized",
            content = [Content(mediaType = "application/json", schema = Schema(implementation = ApiResponseDTO::class))]),
        ApiResponse(responseCode = "404", description = "Record not found",
            content = [Content(mediaType = "application/json", schema = Schema(implementation = ApiResponseDTO::class))])
    ])
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
    @Operation(summary = "Create new feedback", description = "Create a new empty feedback for a record")
    fun createFeedback(
        @RequestParam recordId: Long
    ): ResponseEntity<ApiResponseDTO<String>> {
        val record = recordRepository.findById(recordId).getOrNull() ?: throw NotFoundException()
        val feedback = RecordFeedback(record = record)
        val saved = recordFeedbackRepository.save(feedback)
        return ResponseEntity.ok(ApiResponseDTO(data = saved.id))
    }

    @PutMapping("/feedback/{id}")
    @Operation(summary = "Update feedback status", description = "Update feedback status to PROCESSING")
    fun updateFeedbackStatus(
        @RequestParam id: String
    ): ResponseEntity<ApiResponseDTO<RecordFeedbackDTO>> {
        val feedback = recordFeedbackRepository.findById(id).getOrNull() ?: throw NotFoundException()
        feedback.status = RecordFeedbackStatus.PROCESSING
        val updated = recordFeedbackRepository.save(feedback)
        return ResponseEntity.ok(
            ApiResponseDTO(
                data = RecordFeedbackDTO(
                    id = updated.id,
                    aiFeedback = updated.aiFeedback,
                    comment = updated.comment,
                    data = updated.data,
                    status = updated.status,
                    createdAt = updated.createdAt,
                    updatedAt = updated.updatedAt
                )
            )
        )
    }

    @GetMapping("/feedback")
    @Operation(summary = "Get feedbacks", description = "Get all feedbacks for a record")
    fun getFeedbacks(
        @RequestParam recordId: Long
    ): ResponseEntity<ApiResponseDTO<List<RecordFeedbackDTO>>> {
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
    @Operation(summary = "Get feedback", description = "Get feedback details by ID")
    fun getFeedback(
        @PathVariable id: String
    ): ResponseEntity<ApiResponseDTO<RecordFeedbackDTO>> {
        val feedback = recordFeedbackRepository.findById(id).getOrNull() ?: throw NotFoundException()
        when (feedback.status) {
            RecordFeedbackStatus.QUEUED -> return ResponseEntity.ok(
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

            RecordFeedbackStatus.PROCESSING -> throw FeedBackProcessingException()
            RecordFeedbackStatus.PROCESSING_ERROR -> throw FeedBackProcessErrorException()
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
    @Operation(summary = "Update feedback", description = "Update feedback data and comment")
    fun updateFeedback(
        @PathVariable id: String,
        @RequestBody request: UpdateFeedbackRequest
    ): ResponseEntity<ApiResponseDTO<RecordFeedbackDTO>> {
        val feedback = recordFeedbackRepository.findById(id).getOrNull() ?: throw NotFoundException()
        feedback.data = request.data
        feedback.comment = request.comment
        val updated = recordFeedbackRepository.save(feedback)
        return ResponseEntity.ok(
            ApiResponseDTO(
                data = RecordFeedbackDTO(
                    id = updated.id,
                    aiFeedback = updated.aiFeedback,
                    comment = updated.comment,
                    data = updated.data,
                    status = updated.status,
                    createdAt = updated.createdAt,
                    updatedAt = updated.updatedAt
                )
            )
        )
    }
}