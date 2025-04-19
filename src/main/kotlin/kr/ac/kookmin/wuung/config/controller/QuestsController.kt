package kr.ac.kookmin.wuung.config.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import kr.ac.kookmin.wuung.lib.ApiResponseDTO
import kr.ac.kookmin.wuung.lib.datetimeParser
import kr.ac.kookmin.wuung.model.QuestType
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.model.UserQuests
import kr.ac.kookmin.wuung.repository.QuestsRepository
import kr.ac.kookmin.wuung.repository.UserQuestsRepository
import kr.ac.kookmin.wuung.repository.UserRepository
import kr.ac.kookmin.wuung.exceptions.NotFoundException
import kr.ac.kookmin.wuung.exceptions.UnauthorizedException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrNull

data class UserQuestsDTO(
    val id: String,
    val name: String,
    val description: String,
    val type: QuestType,
    val progress: Int,
    val target: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
fun UserQuests.toDTO() = UserQuestsDTO(
    this.id ?: "",
    this.quest?.name ?: "",
    this.quest?.description ?: "",
    this.quest?.type ?: QuestType.ACTIVITY,
    this.progress,
    this.target,
    this.createdAt,
    this.updatedAt
)

data class MyQuestsResponse(
    val quests: List<UserQuestsDTO>
)
data class CreateQuestRequest(
    val id: Long,
)
data class CreateQuestResponse(
    val data: UserQuestsDTO,
)

@RestController
@RequestMapping("/quests")
@Tag(name = "Quests API", description = "Endpoints for quests")
class QuestsController(
    @Autowired private val authenticationManager: AuthenticationManager,
    @Autowired private val userRepository: UserRepository,
    @Autowired private val questsRepository: QuestsRepository,
    @Autowired private val userQuestsRepository: UserQuestsRepository
) {
    @GetMapping("/me")
    @Operation(
        summary = "Get my quests",
        description = "Get my quests"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully retrieved quests",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = ApiResponseDTO::class))]),
            ApiResponse(responseCode = "403", description = "Invalid request",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = ApiResponseDTO::class))]),
            ApiResponse(responseCode = "500", description = "Internal server error",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = ApiResponseDTO::class))]),
        ]
    )
    fun getQuests(
        @AuthenticationPrincipal userDetails: User?,
        @Schema(description = "Start date in format yyyy-MM-dd", example = "2000-01-01")
        @RequestParam(required = false) start: String?,
    ): ResponseEntity<ApiResponseDTO<MyQuestsResponse>> {
        if (userDetails == null) throw UnauthorizedException()

        val quests = start?.let {
            val startDate = start.datetimeParser()
            userQuestsRepository.findByUserAndCreatedAtAfter(userDetails, startDate)
        } ?: userQuestsRepository.findByUser(userDetails)

        return ResponseEntity.ok(
            ApiResponseDTO(data = MyQuestsResponse(quests.map { it.toDTO() }))
        )
    }

    @PutMapping("")
    @Operation(
        summary = "Create a new quest",
        description = "Creates a new quest instance for the authenticated user"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully created quest",
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
            ),
            ApiResponse(
                responseCode = "404", description = "Quest not found",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(responseCode = "500", description = "Internal server error",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun createQuests(
        @AuthenticationPrincipal userDetails: User?,
        @RequestBody request: CreateQuestRequest,
    ): ResponseEntity<ApiResponseDTO<CreateQuestResponse>> {
        if (userDetails == null) throw UnauthorizedException()

        val quest = questsRepository.findById(request.id).getOrNull() ?: throw NotFoundException()

        val data = UserQuests(
            user = userDetails,
            quest = quest,
            description = quest.description,
            progress = 0,
            target = quest.target
        )

        userQuestsRepository.save(data)

        return ResponseEntity.ok(
            ApiResponseDTO(data = CreateQuestResponse(data.toDTO()))
        )
    }
}