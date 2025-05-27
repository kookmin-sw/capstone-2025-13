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
import kr.ac.kookmin.wuung.model.Topic
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
import kr.ac.kookmin.wuung.repository.TopicRepository
import org.springframework.batch.core.JobParametersBuilder
import org.springframework.batch.core.launch.JobLauncher
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.exceptions.NotFoundException
import kr.ac.kookmin.wuung.exceptions.UnauthorizedException
import kr.ac.kookmin.wuung.lib.datetimeParser
import kr.ac.kookmin.wuung.model.ConfigurationKey
import kr.ac.kookmin.wuung.model.TopicFeedbackStatus
import kr.ac.kookmin.wuung.model.TopicFeedback
import kr.ac.kookmin.wuung.repository.ConfigurationsRepository
import kr.ac.kookmin.wuung.repository.TopicFeedbackRepository
import org.springframework.batch.core.Job
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException
import org.springframework.context.ApplicationContext
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import java.time.LocalDate
import kotlin.collections.map
import kotlin.jvm.optionals.getOrNull

data class TopicDTO(
    val id: String,
    @Schema(
        description = """
        [en] Rating score (1-5 stars), default value is 0 (unrated)
        [ko] 별점 점수 (1-5점), 기본값은 0이다. (평가하지 않음)
    """, minimum = "1", maximum = "5"
    )
    val rate: Int,
    val data: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val feedbacks: List<TopicFeedbackDTO> = emptyList(),
)

fun Topic.toDTO() = TopicDTO(
    this.id ?: "",
    this.rate,
    this.data ?: "",
    this.createdAt,
    this.updatedAt
)

fun Topic.toFullDTO() = TopicDTO(
    this.id ?: "",
    this.rate,
    this.data ?: "",
    this.createdAt,
    this.updatedAt,
    this.topicFeedback.map { it.toDTO() }
)

data class TopicFeedbackRequest(
    val data: String,
)

data class TopicUpdateRequest(
    @Schema(
        description = """
        [en] Rating score (1-5 stars)
        [ko] 별점 점수 (1-5점)
    """, minimum = "1", maximum = "5"
    )
    val rate: Int,
    val data: String,
)

data class TopicFeedbackDTO(
    val id: String?,
    val aiFeedback: String?,
    val comment: String?,
    val data: String?,
    val status: TopicFeedbackStatus,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)
fun TopicFeedback.toDTO() = TopicFeedbackDTO(
    this.id,
    this.aiFeedback,
    this.comment,
    this.data,
    this.status,
    this.createdAt,
    this.updatedAt,
)

data class UpdateFeedbackRequest(
    @Schema(description = "User comment for the feedback")
    val comment: String,

    @Schema(
        description = """
        [en] Rating score (1-5 stars)
        [ko] 별점 점수 (1-5점)
    """, minimum = "1", maximum = "5"
    )
    val rate: Int = 1,
)

@RestController
@RequestMapping("/topic")
@Tag(
    name = "Topic API", description = """
    [en] API endpoints for managing daily topics and their AI-generated feedback
    [ko] 1일 1주제 기록 및 AI 생성 피드백을 관리하기 위한 API 엔드포인트
"""
)
class TopicController(
    @Autowired private val topicRepository: TopicRepository,
    @Autowired private val topicFeedbackRepository: TopicFeedbackRepository,
    @Autowired private val jobLauncher: JobLauncher,
    @Autowired private val configurationsRepository: ConfigurationsRepository,
    @Autowired private val context: ApplicationContext
) {
    @GetMapping("/me")
    @Operation(
        summary = "Get topic information for a specific date", description = """
        [en] Retrieves the most recent topic for a specific date, including topic ID, emotional rate, and content data. Defaults to the current date if no date is specified.
        [ko] 특정 날짜의 가장 최근 기록을 조회합니다. 기록 ID, 감정 수치, 내용 데이터를 포함합니다. 기본 값은 오늘 입니다.
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Get topic successfully",
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
    fun getTopicByDate(
        @AuthenticationPrincipal userDetails: User?,
        @Schema(description = "Date in format yyyy-MM-dd", example = "2025-05-01", type = "string")
        @RequestParam date: String?,
    ): ResponseEntity<ApiResponseDTO<TopicDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        // 요청된 날짜의 시작·끝 시각 계산
        val targetDate: LocalDate = date?.datetimeParser()?.toLocalDate() ?: LocalDate.now()
        val startOfDay: LocalDateTime = targetDate.atStartOfDay()
        val endOfDay: LocalDateTime = targetDate.atTime(23, 59, 59)

        // JPA 메서드로 날짜 범위 내 레코드 조회
        val topics: List<Topic> = topicRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startOfDay,
            endOfDay
        )
    
        // 가장 최신 생성 레코드 선택
        val topic = topics.maxByOrNull { it.createdAt } ?: throw NotFoundException()

        return ResponseEntity.ok(ApiResponseDTO(data = topic.toFullDTO()))
    }

    @OptIn(DelicateCoroutinesApi::class)
    @PutMapping("/create")
    @Operation(summary = "Create new topic", description = """
        [en] Creates a new daily topic with emotional rate and content. Only one topic per day is allowed. Requires valid access token in Authorization header
        [ko] 감정 수치와 내용이 포함된 새로운 일일 기록을 생성합니다. 하루에 한 개의 기록만 허용됩니다. Authorization 헤더에 유효한 접근 토큰이 필요합니다
    """)
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Create topic successfully",
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
                responseCode = "409", description = "Topic already created",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun createTopic(
        @AuthenticationPrincipal userDetails: User?,
    ): ResponseEntity<ApiResponseDTO<TopicDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val today = LocalDate.now()
        val startOfDay = today.atStartOfDay()
        val endOfDay = today.atTime(23, 59, 59)

        // 레코드 하루에 한 개 이상 생성하는 거 방지하려고 추가
        val existingTopics = topicRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startOfDay,
            endOfDay
        )
        if (existingTopics.isNotEmpty()) throw AlreadyExistException()

        val weekTopics = topicRepository.findByUserAndCreatedAtBetweenOrderByCreatedAtDesc(
            userDetails,
            today.minusDays(7).atStartOfDay(),
            endOfDay,
        )
        val dailyQuestions = configurationsRepository.findAllByKey(ConfigurationKey.DAILY_QUESTION)
        if(dailyQuestions.isEmpty()) throw NotFoundException()

        val dailyQuestionWithoutDuplication = dailyQuestions
            .filter { !weekTopics.map { topic -> topic.innerSeq }.contains(it.innerSeq) }

        if (dailyQuestionWithoutDuplication.isEmpty()) throw NotFoundException()

        val selectedQuestion = dailyQuestionWithoutDuplication.random()


        val topic = Topic(
            data = selectedQuestion.value,
            innerSeq = selectedQuestion.innerSeq,
            user = userDetails
        )
        val saved = topicRepository.save(topic)

        GlobalScope.launch {
            runJob()
        }

        return ResponseEntity.ok(ApiResponseDTO(data = saved.toDTO()))
    }

    @PostMapping("/modify/{topicId}")
    @Operation(
        summary = "Modify existing topic information",
        description = """
            [en] Updates the emotional rate and content data of an existing topic. Only the topic owner can modify their topics
            [ko] 기존 기록의 감정 수치와 내용을 수정합니다. 기록 소유자만 수정할 수 있습니다
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Update topic successfully",
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
                responseCode = "404", description = "Topic not found",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun modifyTopic(
        @AuthenticationPrincipal userDetails: User?,
        @RequestBody request: TopicUpdateRequest,
        @PathVariable topicId: String,
    ): ResponseEntity<ApiResponseDTO<TopicDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val topic = topicRepository.findById(topicId).getOrNull() ?: throw NotFoundException()
        if (topic.user?.id != userDetails.id) throw UnauthorizedException()

        val latestFeedback = topic.topicFeedback.maxByOrNull { it.createdAt }
        if(latestFeedback == null) throw NotFoundException()

        topic.rate = request.rate
        latestFeedback.comment = request.data
        // updatedAt은 @PreUpdate로 자동 갱신

        return ResponseEntity.ok(ApiResponseDTO(data = topic.toFullDTO()))
    }

    @OptIn(DelicateCoroutinesApi::class)
    @PutMapping("/feedback/{topicId}")
    @Operation(
        summary = "Request AI feedback", description = """
        [en] Initiates an AI feedback request for a specific topic. The feedback process runs asynchronously and updates the feedback status accordingly
        [ko] 특정 기록에 대한 AI 피드백 요청을 시작합니다. 피드백 프로세스는 비동기적으로 실행되며 피드백 상태가 그에 따라 업데이트됩니다, 피드백의 개수가 5개 이상일 경우, 피드백을 받지 않는 사용자 데이터 저장 용도의 레코드를 생성합니다.
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
                responseCode = "403", description = "Limit Reached, Feedback can't add",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "404", description = "Feedback topic not found",
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
        @PathVariable topicId: String,
        @RequestBody request: TopicFeedbackRequest,
    ): ResponseEntity<ApiResponseDTO<String>> {
        if (userDetails == null) throw UnauthorizedException()

        // NullPointerException or IllegalArgumentException could trigger ServletException
        if (topicId.isBlank() || request.data.isBlank()) {
            throw IllegalArgumentException()
        }

        val topic = topicRepository.findById(topicId).getOrNull() ?: throw NotFoundException()

        if(topic.user?.id != userDetails.id) throw UnauthorizedException()

        val feedbackNum = topic.topicFeedback.size

        if (feedbackNum >= 7) throw LimitReachedException()


        // Limit Reached 예외 대신 데이터베이스에 데이터 추가 후 ID 반환
         if(feedbackNum >= 5) {
             val feedback = TopicFeedback(
                 topic = topic,
                 data = request.data,
                 status = TopicFeedbackStatus.NOFEEDBACK
             )
             topic.topicFeedback.add(feedback)
             val saved = topicFeedbackRepository.save(feedback)

             return ResponseEntity.ok(
                 ApiResponseDTO(
                     data = saved.id
                 )
             )
         }

        val lastFeedback = topic.topicFeedback.lastOrNull()
        
        
        if (lastFeedback != null) when (lastFeedback.status) {
            TopicFeedbackStatus.QUEUED -> AiFeedbackNotCompleteException()
            TopicFeedbackStatus.PROCESSING -> throw AiFeedbackNotCompleteException()
            TopicFeedbackStatus.PROCESSING_ERROR -> throw AiFeedbackErrorException()
            TopicFeedbackStatus.COMPLETED -> Unit
            TopicFeedbackStatus.NOFEEDBACK -> throw LimitReachedException() // 추가 예외 처리
        }

        val feedback = TopicFeedback(
            topic = topic,
            data = request.data,
            status = TopicFeedbackStatus.QUEUED,
        )
        topic.topicFeedback.add(feedback)
        topicFeedbackRepository.save(feedback)

        GlobalScope.launch {
            runJob()
        }

        return ResponseEntity.ok(
            ApiResponseDTO(
                data = feedback.id
            )
        )
    }

    @GetMapping("/{topicId}")
    @Operation(
        summary = "Get all feedback topic", description = """
        [en] Retrieves all completed AI feedback topics associated with a specific topic. Only shows feedback with COMPLETED status
        [ko] 특정 기록과 관련된 모든 피드백을 조회합니다. COMPLETED 상태의 피드백과 NOFEEDBACK 상태의 피드백도 표시됩니다
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Get feedback topics successfully",
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
                responseCode = "404", description = "Topic not found",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun getFeedbacks(
        @AuthenticationPrincipal userDetails: User?,
        @PathVariable topicId: String,
    ): ResponseEntity<ApiResponseDTO<List<TopicFeedbackDTO>>> {

        if (userDetails == null) throw UnauthorizedException()
        val topic = topicRepository.findById(topicId).getOrNull() ?: throw NotFoundException()

        if(topic.user?.id != userDetails.id) throw UnauthorizedException()

        val feedbacks = topic.topicFeedback.filter { it.status == TopicFeedbackStatus.COMPLETED || it.status == TopicFeedbackStatus.NOFEEDBACK }

        if (feedbacks.isEmpty()) throw NotFoundException()

        return ResponseEntity.ok(ApiResponseDTO(data = feedbacks.map {
            it.toDTO()
        }))
    }

    @GetMapping("/feedback/{topicFeedbackId}")
    @Operation(
        summary = "Get feedback topic", description = """
        [en] Retrieves detailed information about a specific feedback topic, including AI feedback content and user comments
        [ko] 특정 피드백 기록의 상세 정보를 조회합니다. AI 피드백 내용과 사용자 댓글을 포함합니다.
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Get feedback topic successfully",
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
                responseCode = "404", description = "Feedback topic not found",
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
        @PathVariable topicFeedbackId: String,
    ): ResponseEntity<ApiResponseDTO<TopicFeedbackDTO>> {
        if (userDetails == null) throw UnauthorizedException()
        val feedback = topicFeedbackRepository.findById(topicFeedbackId).getOrNull() ?: throw NotFoundException()

        if(feedback.topic?.user?.id != userDetails.id) throw UnauthorizedException()

        when (feedback.status) {
            TopicFeedbackStatus.QUEUED -> throw AiFeedbackNotCompleteException()
            TopicFeedbackStatus.PROCESSING -> throw AiFeedbackNotCompleteException()
            TopicFeedbackStatus.PROCESSING_ERROR -> throw AiFeedbackErrorException()
            TopicFeedbackStatus.COMPLETED -> Unit
            TopicFeedbackStatus.NOFEEDBACK -> Unit
        }

        return ResponseEntity.ok(
            ApiResponseDTO(
                data = feedback.toDTO()
            )
        )
    }


    @PostMapping("/feedback/{topicId}")
    @Operation(
        summary = "Update feedback topic", description = """
        [en] Updates the data and user comments of a completed feedback topic. Only the topic owner can update their topics feedbacks. Only applies to COMPLETED feedback topics.
        [ko] 완료된 피드백 기록의 데이터와 사용자 댓글을 업데이트합니다. 레코드의 주인만 레코드의 피드백을 수정할 수 있습니다. 마지막 요청이 COMPLETED 상태인 피드백에만 적용 가능합니다.
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
                responseCode = "403", description = "No Feedback record can't update",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "404", description = "Feedback topic not found",
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
        @PathVariable topicId: String,
        @RequestBody request: UpdateFeedbackRequest,
    ): ResponseEntity<ApiResponseDTO<TopicDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val topic = topicRepository.findById(topicId).getOrNull() ?: throw NotFoundException()

        if(topic.user?.id != userDetails.id) throw UnauthorizedException()

        val feedback = topic.topicFeedback.lastOrNull() ?: throw NotFoundException()

        when (feedback.status) {
            TopicFeedbackStatus.QUEUED -> throw AiFeedbackNotCompleteException()
            TopicFeedbackStatus.PROCESSING -> throw AiFeedbackNotCompleteException()
            TopicFeedbackStatus.PROCESSING_ERROR -> throw AiFeedbackErrorException()
            TopicFeedbackStatus.COMPLETED -> Unit
            TopicFeedbackStatus.NOFEEDBACK -> AiFeedbackNotEnableException()
        }

        // 데이터 업데이트
        feedback.comment = request.comment
        topic.rate = request.rate

        topicFeedbackRepository.save(feedback)

        return ResponseEntity.ok(ApiResponseDTO(
            data = topic.toFullDTO()
        ))
    }

    @Scheduled(fixedRate = 10000L)
    private fun runJob() {
        val job = context.getBean("topicJob", Job::class.java)
        val jobParameters = JobParametersBuilder()
            .addLong("time", System.currentTimeMillis())
            .toJobParameters()

        try {
            jobLauncher.run(job, jobParameters)
        } catch (e: JobInstanceAlreadyCompleteException) {
            // Job already running, wait and retry
            Thread.sleep(1000L)
            jobLauncher.run(job, jobParameters)
        }
    }
}