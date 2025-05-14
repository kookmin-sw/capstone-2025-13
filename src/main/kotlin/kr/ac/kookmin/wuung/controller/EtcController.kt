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
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.model.UserQuestStatus
import kr.ac.kookmin.wuung.repository.DiagnosisResultsRepository
import kr.ac.kookmin.wuung.repository.RecordRepository
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

enum class BehaviorType(val value : String){
    DIARY("DIARY"),
    QUEST("QUEST"),
    DIAGNOSIS("DIAGNOSIS")
}

data class DailyBehaviorDTO(
    val title : String,
    val content : String,
    val type : BehaviorType,
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
    @Autowired private val userQuestStageRepository: UserQuestStageRepository
) {
    @GetMapping("/behavior")
    @Operation(summary = "Get User behavior information by date",
        description = "Get behavior information by date")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Get user behavior information successfully",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "403", description = "Unauthorized access",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun getBehaviorByDate(
        @AuthenticationPrincipal userDetails: User?,
        @RequestParam("date") @DateTimeFormat(pattern = "yyyy-MM-dd") date: String
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
            when (result.diagnosis?.type) {
                DiagnosisType.`GAD-7` -> DailyBehaviorDTO("검사", "GAD-7 검사 시행 완료", BehaviorType.DIAGNOSIS)
                DiagnosisType.`PHQ-9` -> DailyBehaviorDTO("검사", "PHQ-9 검사 시행 완료", BehaviorType.DIAGNOSIS)
                DiagnosisType.Simple -> DailyBehaviorDTO("검사", "약식 검사 시행 완료", BehaviorType.DIAGNOSIS)
                DiagnosisType.BDI -> DailyBehaviorDTO("검사", "BDI 검사 시행 완료", BehaviorType.DIAGNOSIS)
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
                BehaviorType.DIARY
            )
            behaviors = behaviors + recordBehavior
        }


        val userQuests = userQuestRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startDate,
            endDate
        )

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
                BehaviorType.QUEST
            )
        }
        
        behaviors = behaviors + questBehaviors

        return ResponseEntity.ok(
            ApiResponseDTO(
                data = behaviors
            )
        )
    }
}