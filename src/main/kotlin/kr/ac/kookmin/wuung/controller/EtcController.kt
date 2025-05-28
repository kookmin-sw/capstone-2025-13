package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import io.swagger.v3.oas.annotations.media.Schema
import kr.ac.kookmin.wuung.exceptions.UnauthorizedException
import kr.ac.kookmin.wuung.lib.ApiResponseDTO
import kr.ac.kookmin.wuung.lib.datetimeParser
import kr.ac.kookmin.wuung.model.DiagnosisType
import kr.ac.kookmin.wuung.model.QuestType
import kr.ac.kookmin.wuung.model.TopicFeedbackStatus
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.model.UserQuestStatus
import kr.ac.kookmin.wuung.repository.DiagnosisResultsRepository
import kr.ac.kookmin.wuung.repository.RecordRepository
import kr.ac.kookmin.wuung.repository.TopicFeedbackRepository
import kr.ac.kookmin.wuung.repository.TopicRepository
import kr.ac.kookmin.wuung.repository.UserQuestStageRepository
import kr.ac.kookmin.wuung.repository.UserQuestsRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import java.time.format.DateTimeFormatter

enum class BehaviorType(val value : String){
    DIARY("DIARY"),
    QUEST("QUEST"),
    DIAGNOSIS("DIAGNOSIS"),
    TOPIC("TOPIC")
}

data class DailyBehaviorDTO(
    val title : String,
    val content : String,
    val type : BehaviorType,
    val id: String,
)

@RestController
@RequestMapping("/etc")
@Tag(
    name = "etc API", description = """
    [En] Support convenience for Front End Side
    AccessToken is required for all of this part of endpoints on Authorization header.
    [Kr] 프론트 엔드를 위한 편의성 지원용 API
    해당 API를 사용하기 위해서는 Authorization 헤더에 AccessToken을 명시해야합니다.
"""
)
class EtcController(
    @Autowired private val diagnosisResultsRepository: DiagnosisResultsRepository,
    @Autowired private val recordRepository: RecordRepository,
    @Autowired private val userQuestRepository: UserQuestsRepository,
    @Autowired private val userQuestStageRepository: UserQuestStageRepository,
    @Autowired private val topicRepository: TopicRepository,
    @Autowired private val topicFeedbackRepository: TopicFeedbackRepository,
) {
    private val dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")

    @GetMapping("/behavior")
    @Operation(
        summary = "[En] Get User behavior information by date / [Kr] 특정 날짜의 사용자 활동 정보 조회",
        description = """
            [En] Returns a list of user activities including diagnosis tests, diaries and quests completed on a specific date.
            The date parameter should be in yyyy-MM-dd format.
            [Kr] 특정 날짜에 수행한 검사, 일기 작성, 퀘스트 완료 등의 사용자 활동 목록을 반환합니다.
            날짜 파라미터는 yyyy-MM-dd 형식이어야 합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = """
                    [En] Successfully retrieved user behavior information for the specified date
                    [Kr] 지정된 날짜의 사용자 활동 정보를 성공적으로 조회했습니다
                """,
                useReturnTypeSchema = true,
            ),
            ApiResponse(
                responseCode = "403",
                description = """
                    [En] Unauthorized access - Valid authentication token required
                    [Kr] 인증되지 않은 접근 - 유효한 인증 토큰이 필요합니다
                """,
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun getBehaviorByDate(
        @AuthenticationPrincipal userDetails: User?,
        @RequestParam("date") @DateTimeFormat(pattern = "yyyy-MM-dd") date: String,
    ): ResponseEntity<ApiResponseDTO<List<DailyBehaviorDTO>>> {

        if (userDetails == null) throw UnauthorizedException()

        val startDate = date.datetimeParser()
        val endDate = startDate.plusDays(1)

        val diagnosis = diagnosisResultsRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startDate,
            endDate
        )

        var behaviors: List<DailyBehaviorDTO> = diagnosis.mapNotNull { result ->
            when (result.diagnosis.type) {
                DiagnosisType.`GAD-7` -> DailyBehaviorDTO("검사", "GAD-7 검사 시행 완료", BehaviorType.DIAGNOSIS, result.id!!)
                DiagnosisType.`PHQ-9` -> DailyBehaviorDTO("검사", "PHQ-9 검사 시행 완료", BehaviorType.DIAGNOSIS, result.id!!)
                DiagnosisType.Simple -> DailyBehaviorDTO("검사", "약식 검사 시행 완료", BehaviorType.DIAGNOSIS, result.id!!)
                DiagnosisType.BDI -> DailyBehaviorDTO("검사", "BDI 검사 시행 완료", BehaviorType.DIAGNOSIS, result.id!!)
                else -> null
            }
        }

        val records = recordRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startDate,
            endDate
        )

        if (records.isNotEmpty()) {
            val recordBehavior = DailyBehaviorDTO(
                "일기",
                "${startDate.monthValue}월 ${startDate.dayOfMonth}일 일기 작성 완료",
                BehaviorType.DIARY,
                records.first().id!!
            )
            behaviors = behaviors + recordBehavior
        }


        val userQuests = userQuestRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startDate,
            endDate
        ).sortedBy { it.createdAt }

        val userMainStages = userQuestStageRepository.findByUser(userDetails)

        val questBehaviors = userQuests.mapNotNull { quest ->
            val stage = userMainStages.find { it.type == quest.quest?.type }?.stage ?: return@mapNotNull null
            val questType = when (quest.quest?.type) {
                QuestType.MEDITATE -> "명상하기"
                QuestType.ACTIVITY -> "운동하기"
                QuestType.EMOTION -> "감정 표현하기"
                else -> return@mapNotNull null
            }

            val status = when (quest.status) {
                UserQuestStatus.COMPLETED -> "수행 완료"
                else -> return@mapNotNull null
            }

            DailyBehaviorDTO(
                "퀘스트",
                "${stage}-${quest.quest?.step} $questType $status",
                BehaviorType.QUEST,
                quest.id!!
            )
        }

        behaviors = behaviors + questBehaviors

        val todayTopics = topicRepository.findByUserAndCreatedAtBetween(userDetails, startDate, endDate)

        // 한 번이라도 대화를 했다면
        if (todayTopics.size >= 1) {
            
            // 각 주제에서 피드백 뽑아서
            todayTopics.forEach { topic ->
                val hasPendingFeedback = topic.topicFeedback.any { feedback -> feedback.status == TopicFeedbackStatus.NOFEEDBACK } // NOFEEDBACK이 있는지 확인

                // 하나라도 대화가 완료된 내역이 있다면 행동에 추가
                if (hasPendingFeedback) {
                    behaviors += DailyBehaviorDTO(
                        title = "매일 1주제",
                        content = "매일 1주제 대화 완료",
                        type = BehaviorType.TOPIC,
                        id = topic.id!!
                    )
                    return@forEach
                }
            }
        }

        return ResponseEntity.ok(
            ApiResponseDTO(
                data = behaviors
            )
        )
    }

    @GetMapping("/behavior/summary")
    @Operation(
        summary = "[En] Get User behavior summary by month / [Kr] 월별 사용자 활동 요약 조회",
        description = """
            [En] Returns a list of dates in the specified month where the user had any activity (diagnosis tests or diary entries).
            The date parameter should be in yyyy-MM format.
            [Kr] 지정된 달에 사용자가 활동(검사 또는 일기 작성)을 한 날짜 목록을 반환합니다.
            날짜 파라미터는 yyyy-MM 형식이어야 합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = """
                    [En] Successfully retrieved user behavior summary for the specified month
                    [Kr] 지정된 월의 사용자 활동 요약을 성공적으로 조회했습니다
                """,
                useReturnTypeSchema = true,
            ),
            ApiResponse(
                responseCode = "403",
                description = """
                    [En] Unauthorized access - Valid authentication token required
                    [Kr] 인증되지 않은 접근 - 유효한 인증 토큰이 필요합니다
                """,
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun getBehaviorByMontly(
        @AuthenticationPrincipal userDetails: User?,
        @RequestParam("date") @DateTimeFormat(pattern = "yyyy-MM") date: String,
    ): ResponseEntity<ApiResponseDTO<List<String>>> {
        if (userDetails == null) throw UnauthorizedException()

        val startDate = "${date}-01".datetimeParser()
        val endDate = "${date}-31".datetimeParser().withHour(23).withMinute(59).withSecond(59)

        val records = recordRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startDate,
            endDate
        )

        val diagnosis = diagnosisResultsRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startDate,
            endDate
        )

        val behaviors = userQuestRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startDate,
            endDate
        )

        val date = mutableListOf<String>()

        records.forEach { record ->
            date.add(record.createdAt.format(dateFormatter))
        }
        diagnosis.forEach { diagnosis ->
            date.add(diagnosis.createdAt.format(dateFormatter))
        }
        behaviors.forEach { behavior ->
            date.add(behavior.createdAt.format(dateFormatter))
        }

        // 토픽들 찾아서
        val topics = topicRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startDate,
            endDate
        )

        // NOFEEDBACK 있는 애만 date에 싹 다 추가
        topics.forEach { topic ->
            if (topic.topicFeedback.any { feedback -> feedback.status == TopicFeedbackStatus.NOFEEDBACK }) {
                date.add(topic.createdAt.format(dateFormatter))
            }
        }

        return ResponseEntity.ok(ApiResponseDTO(data = date.distinct()))
    }
}
