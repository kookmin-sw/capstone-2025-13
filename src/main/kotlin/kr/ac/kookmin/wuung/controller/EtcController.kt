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
import kr.ac.kookmin.wuung.repository.DiagnosisResultsRepository
import kr.ac.kookmin.wuung.repository.RecordRepository
import kr.ac.kookmin.wuung.repository.UserQuestsRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.security.core.annotation.AuthenticationPrincipal


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
    @Autowired private val userQuestRepository: UserQuestsRepository
) {
    @GetMapping("/behavior")
    @Operation(summary = "Get behavior information successfully")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Get behavior information successfully",
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
            )
        ]
    )
    fun getBehaviorByDate(
        @AuthenticationPrincipal userDetails: User?,
        @RequestParam("date") @DateTimeFormat(pattern = "yyyy-MM-dd") date: String
    ): ResponseEntity<ApiResponseDTO<List<Pair<String, String>>>> {

        if (userDetails == null) throw UnauthorizedException()

        val startDate = date.datetimeParser()
        val endDate = startDate.plusDays(1)

        val diagnosis = diagnosisResultsRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startDate,
            endDate
        )

        var behaviors: List<Pair<String, String>> = diagnosis.mapNotNull { result ->
            when (result.diagnosis?.type) {
                DiagnosisType.GAD_7 -> "GAD-7" to "불안 검사 시행"
                DiagnosisType.PHQ_9 -> "PHQ-9" to "우울 검사 시행"
                DiagnosisType.Simple -> "SIMPLE" to "간단 검사 시행"
                DiagnosisType.BDI -> "BDI" to "우울 검사 시행"
                else -> null
            }
        }

        val records = recordRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startDate,
            endDate
        )

        if (records.isNotEmpty()) {
            val recordBehavior = "기록" to "${startDate.monthValue}월 ${startDate.dayOfMonth}일 기록 작성"
            behaviors = behaviors + recordBehavior
        }

        val userQuests = userQuestRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startDate,
            endDate
        )

        val userQuestBehaviors = userQuests.mapNotNull { userQuest ->
            val status = if (userQuest.target == userQuest.progress) "완료" else "수행 중"
            val quest = userQuest.quest ?: return@mapNotNull null

            val questType = when (quest.type) {
                QuestType.MEDITATE -> "명상하기"
                QuestType.ACTIVITY -> "운동하기"
                QuestType.EMOTION -> "감정 표현하기"
                null -> return@mapNotNull null
            }

            val behaviorDesc = "${userQuest.id}-${quest.step} $status"
            questType to behaviorDesc
        }


        behaviors = behaviors + userQuestBehaviors

        return ResponseEntity.ok(
            ApiResponseDTO(
                data = behaviors
            )
        )
    }
}