package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kr.ac.kookmin.wuung.model.Record
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
import org.springframework.security.core.annotation.AuthenticationPrincipal
import kr.ac.kookmin.wuung.exceptions.*
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.http.ResponseEntity
import kr.ac.kookmin.wuung.lib.ApiResponseDTO
import kr.ac.kookmin.wuung.repository.RecordRepository
import org.springframework.batch.core.JobParametersBuilder
import org.springframework.batch.core.launch.JobLauncher
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.exceptions.NotFoundException
import kr.ac.kookmin.wuung.exceptions.UnauthorizedException
import kr.ac.kookmin.wuung.lib.datetimeParser
import kr.ac.kookmin.wuung.model.RecordFeedback
import kr.ac.kookmin.wuung.model.RecordFeedbackStatus
import kr.ac.kookmin.wuung.repository.RecordFeedbackRepository
import org.springframework.batch.core.Job
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import java.time.LocalDate
import kotlin.collections.map
import kotlin.jvm.optionals.getOrNull

data class RecordDTO(
    val id: String,
    val rate: Int,
    val data: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val feedbacks: List<RecordFeedbackDTO> = emptyList(),
)

fun Record.toDTO() = RecordDTO(
    this.id ?: "",
    this.rate,
    this.data ?: "",
    this.createdAt,
    this.updatedAt
)

fun Record.toFullDTO() = RecordDTO(
    this.id ?: "",
    this.rate,
    this.data ?: "",
    this.createdAt,
    this.updatedAt,
    this.recordFeedback.map { it.toDTO() }
)

data class CreateRecordRequest(
    val rate: Int,
    val data: String,
)

data class RecordFeedbackRequest(
    val data: String,
)

data class RecordUpdateRequest(
    val id: String,
    val rate: Int,
)

data class RecordFeedbackDTO(
    val id: String?,
    val aiFeedback: String?,
    val comment: String?,
    val data: String?,
    val status: RecordFeedbackStatus,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)
fun RecordFeedback.toDTO() = RecordFeedbackDTO(
    this.id,
    this.aiFeedback,
    this.comment,
    this.data,
    this.status,
    this.createdAt,
    this.updatedAt,
)

data class UpdateFeedbackRequest(
    val comment: String,
    val rate: Int = 1
)

@RestController
@RequestMapping("/record")
@Tag(
    name = "Record API", description = """
    [en] API endpoints for managing daily records and their AI-generated feedback
    [ko] 일일 기록 및 AI 생성 피드백을 관리하기 위한 API 엔드포인트
"""
)
class RecordController(
    @Autowired private val recordRepository: RecordRepository,
    @Autowired private val recordFeedbackRepository: RecordFeedbackRepository,
    @Autowired private val jobLauncher: JobLauncher,
    @Autowired private val recordJob: Job,
) {
    @GetMapping("/me")
    @Operation(
        summary = "Get record information for a specific date", description = """
        [en] Retrieves the most recent record for a specific date, including record ID, emotional rate, and content data
        [ko] 특정 날짜의 가장 최근 기록을 조회합니다. 기록 ID, 감정 수치, 내용 데이터를 포함합니다
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Get record successfully",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "401", description = "Unauthorized",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun getRecordByDate(
        @AuthenticationPrincipal userDetails: User?,
        @Schema(description = "Date in format yyyy-MM-dd", example = "2025-05-01", type = "string")
        @RequestParam date: String,
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
    
        // 가장 최신 생성 레코드 선택
        val record = records.maxByOrNull { it.createdAt } ?: throw NotFoundException()

        return ResponseEntity.ok(ApiResponseDTO(data = record.toFullDTO()))
    }

    @OptIn(DelicateCoroutinesApi::class)
    @PutMapping("/create")
    @Operation(summary = "Create new record", description = """
        [en] Creates a new daily record with emotional rate and content. Only one record per day is allowed. Requires valid access token in Authorization header
        [ko] 감정 수치와 내용이 포함된 새로운 일일 기록을 생성합니다. 하루에 한 개의 기록만 허용됩니다. Authorization 헤더에 유효한 접근 토큰이 필요합니다
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

        val recordFeedback = RecordFeedback(
            record = record,
            data = request.data,
            status = RecordFeedbackStatus.QUEUED,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now(),
        )
        recordFeedbackRepository.save(recordFeedback)

        GlobalScope.launch {
            runJob()
        }

        return ResponseEntity.ok(ApiResponseDTO(data = saved.toDTO()))
    }

    @PostMapping("/modify")
    @Operation(
        summary = "Modify existing record information",
        description = """
            [en] Updates the emotional rate and content data of an existing record. Only the record owner can modify their records
            [ko] 기존 기록의 감정 수치와 내용을 수정합니다. 기록 소유자만 수정할 수 있습니다
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Update record successfully",
                useReturnTypeSchema = true
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
        @RequestBody request: RecordUpdateRequest,
    ): ResponseEntity<ApiResponseDTO<RecordDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val record = recordRepository.findById(request.id).getOrNull() ?: throw NotFoundException()
        if (record.user?.id != userDetails.id) throw UnauthorizedException()

        record.rate = request.rate
        // updatedAt은 @PreUpdate로 자동 갱신

        val updated = recordRepository.save(record)
        return ResponseEntity.ok(ApiResponseDTO(data = updated.toDTO()))
    }

    @PutMapping("/feedback")
    @Operation(
        summary = "Create new feedback record", description = """
        [en] Initializes a new empty feedback record associated with an existing daily record. This is the first step in the AI feedback process
        [ko] 기존 일일 기록에 연결된 새로운 빈 피드백 기록을 초기화합니다. AI 피드백 프로세스의 첫 단계입니다
    """
    )
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
    @Operation(
        summary = "Request AI feedback", description = """
        [en] Initiates an AI feedback request for a specific record. The feedback process runs asynchronously and updates the feedback status accordingly
        [ko] 특정 기록에 대한 AI 피드백 요청을 시작합니다. 피드백 프로세스는 비동기적으로 실행되며 피드백 상태가 그에 따라 업데이트됩니다
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Feedback request successfully",
                useReturnTypeSchema = true
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
        @PathVariable recordId: String,
        @RequestBody request: RecordFeedbackRequest,
    ): ResponseEntity<ApiResponseDTO<String>> {
        if (userDetails == null) throw UnauthorizedException()

        // NullPointerException or IllegalArgumentException could trigger ServletException
        if (recordId.isBlank() || request.data.isBlank()) {
            throw IllegalArgumentException()
        }

        val record = recordRepository.findById(recordId).getOrNull() ?: throw NotFoundException()

        val feedbackNum = record.recordFeedback.size

        if(feedbackNum >= 5) throw LimitReachedException()

        val lastFeedback = record.recordFeedback.lastOrNull() ?: throw NotFoundException()

        when (lastFeedback.status) {
            RecordFeedbackStatus.QUEUED -> AiFeedbackNotCompleteException()
            RecordFeedbackStatus.PROCESSING -> throw AiFeedbackNotCompleteException()
            RecordFeedbackStatus.PROCESSING_ERROR -> throw AiFeedbackErrorException()
            RecordFeedbackStatus.COMPLETED -> Unit
        }

        val feedback = RecordFeedback(
            record = record,
            data = request.data,
            status = RecordFeedbackStatus.QUEUED,
        )
        record.recordFeedback.add(feedback)
        recordFeedbackRepository.save(feedback)

        GlobalScope.launch {
            runJob()
        }

        return ResponseEntity.ok(
            ApiResponseDTO(
                data = feedback.id
            )
        )
    }

    @GetMapping("/feedback")
    @Operation(
        summary = "Get all feedback record", description = """
        [en] Retrieves all completed AI feedback records associated with a specific record. Only shows feedback with COMPLETED status
        [ko] 특정 기록과 관련된 모든 완료된 AI 피드백 기록을 조회합니다. COMPLETED 상태의 피드백만 표시됩니다
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Get feedback records successfully",
                useReturnTypeSchema = true
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
        @PathVariable recordId: String,
    ): ResponseEntity<ApiResponseDTO<List<RecordFeedbackDTO>>> {

        if (userDetails == null) throw UnauthorizedException()
        val record = recordRepository.findById(recordId).getOrNull() ?: throw NotFoundException()

        val feedbacks = record.recordFeedback.filter { it.status == RecordFeedbackStatus.COMPLETED }

        if (feedbacks.isEmpty()) throw NotFoundException()

        return ResponseEntity.ok(ApiResponseDTO(data = feedbacks.map {
            it.toDTO()
        }))
    }

    @GetMapping("/feedback/{id}")
    @Operation(
        summary = "Get feedback record", description = """
        [en] Retrieves detailed information about a specific feedback record, including AI feedback content and user comments
        [ko] 특정 피드백 기록의 상세 정보를 조회합니다. AI 피드백 내용과 사용자 댓글을 포함합니다
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Get feedback record successfully",
                useReturnTypeSchema = true
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
        @PathVariable recordFeedbackId: String,
    ): ResponseEntity<ApiResponseDTO<RecordFeedbackDTO>> {

        if (userDetails == null) throw UnauthorizedException()
        val feedback = recordFeedbackRepository.findById(recordFeedbackId).getOrNull() ?: throw NotFoundException()

        when (feedback.status) {
            RecordFeedbackStatus.QUEUED -> throw AiFeedbackNotCompleteException()
            RecordFeedbackStatus.PROCESSING -> throw AiFeedbackNotCompleteException()
            RecordFeedbackStatus.PROCESSING_ERROR -> throw AiFeedbackErrorException()
            RecordFeedbackStatus.COMPLETED -> Unit
        }

        return ResponseEntity.ok(
            ApiResponseDTO(
                data = feedback.toDTO()
            )
        )
    }


    @PostMapping("/feedback/{id}")
    @Operation(
        summary = "Update feedback record", description = """
        [en] Updates the data and user comments of a completed feedback record. Only applicable to feedback with COMPLETED status
        [ko] 완료된 피드백 기록의 데이터와 사용자 댓글을 업데이트합니다. COMPLETED 상태의 피드백에만 적용 가능합니다
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Update feedback successfully",
                useReturnTypeSchema = true
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
        @PathVariable recordId: String,
        @RequestBody request: UpdateFeedbackRequest,
    ): ResponseEntity<ApiResponseDTO<RecordDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val record = recordRepository.findById(recordId).getOrNull() ?: throw NotFoundException()

        val feedback = record.recordFeedback.lastOrNull() ?: throw NotFoundException()

        when (feedback.status) {
            RecordFeedbackStatus.QUEUED -> throw AiFeedbackNotCompleteException()
            RecordFeedbackStatus.PROCESSING -> throw AiFeedbackNotCompleteException()
            RecordFeedbackStatus.PROCESSING_ERROR -> throw AiFeedbackErrorException()
            RecordFeedbackStatus.COMPLETED -> Unit
        }

        // 데이터 업데이트
        feedback.comment = request.comment
        record.rate = request.rate

        return ResponseEntity.ok(ApiResponseDTO(
            data = record.toFullDTO()
        ))
    }

    private fun runJob() {
        val jobParameters = JobParametersBuilder()
            .addLong("time", System.currentTimeMillis())
            .toJobParameters()

        try {
            jobLauncher.run(recordJob, jobParameters)
        } catch (e: JobInstanceAlreadyCompleteException) {
            // Job already running, wait and retry
            Thread.sleep(1000L)
            jobLauncher.run(recordJob, jobParameters)
        }
    }
}