package kr.ac.kookmin.wuung.controller

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
import kr.ac.kookmin.wuung.exceptions.ServerErrorException
import kr.ac.kookmin.wuung.exceptions.UnauthorizedException
import kr.ac.kookmin.wuung.model.Quests
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
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
data class CreateQuestRequest(
    val id: Long,
)
data class UpdateQuestRequest(
    val id: String,
    val current: Int,
)

data class QuestsDTO(
    val id: Long,
    val type: QuestType,
    val name: String,
    val description: String,
    val target: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
fun Quests.toDTO() = QuestsDTO(
    id = this.id ?: 0,
    type = this.type ?: QuestType.ACTIVITY,
    name = this.name ?: "",
    description = this.description ?: "",
    target = this.target,
    createdAt = this.createdAt,
    updatedAt = this.updatedAt
)

@RestController
@RequestMapping("/quests")
@Tag(name = "Quests API", description = """
    [en] Endpoints for quests.
    AccessToken is required for all of this part of endpoints on Authorization header.
    
    [ko] 퀘스트 관련 엔드포인트입니다.
    모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.
""")
class QuestsController(
    @Autowired private val authenticationManager: AuthenticationManager,
    @Autowired private val userRepository: UserRepository,
    @Autowired private val questsRepository: QuestsRepository,
    @Autowired private val userQuestsRepository: UserQuestsRepository
) {
    @GetMapping("/me")
    @Operation(
        summary = "Get my quests",
        description = """
            [en] Get my quests with optional filter by start date.
            Start date is in format yyyy-MM-dd.
            If start date is not provided, it will return all quests.
            AccessToken is required for all of this part of endpoints on Authorization header.
            
            [ko] 시작 날짜로 필터링 할 수 있는 내 퀘스트 목록을 가져옵니다.
            시작 날짜는 yyyy-MM-dd 형식입니다.
            시작 날짜가 제공되지 않으면 모든 퀘스트를 반환합니다.
            모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully retrieved quests", useReturnTypeSchema = true),
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
    ): ResponseEntity<ApiResponseDTO<List<UserQuestsDTO>>> {
        if (userDetails == null) throw UnauthorizedException()

        val quests = start?.let {
            val startDate = start.datetimeParser()
            userQuestsRepository.findByUserAndCreatedAtAfter(userDetails, startDate)
        } ?: userQuestsRepository.findByUser(userDetails)

        return ResponseEntity.ok(
            ApiResponseDTO(data = quests.map { it.toDTO() })
        )
    }

    @PutMapping("")
    @Operation(
        summary = "Create a new quest",
        description = """
            [en] Creates a new quest instance for the authenticated user.
            Required parameter is quest (unique) id.
            AccessToken is required for all of this part of endpoints on Authorization header.
            
            [ko] 인증된 사용자를 위한 새로운 퀘스트 요소를 생성합니다.
            필수 파라미터는 퀘스트 (고유) ID입니다.
            모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully created quest", useReturnTypeSchema = true
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
    ): ResponseEntity<ApiResponseDTO<UserQuestsDTO>> {
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
            ApiResponseDTO(data = data.toDTO())
        )
    }

    @PostMapping("")
    @Operation(
        summary = "Update quest progress",
        description = """
            [en] Updates the progress of a quest for the authenticated user.
            Required parameter is quest (unique) id.
            AccessToken is required for all of this part of endpoints on Authorization header.
            
            [ko] 인증된 사용자의 퀘스트 진행 상황을 업데이트합니다.
            필수 파라미터는 퀘스트 (고유) ID입니다.
            모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully updated quest", useReturnTypeSchema = true
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
            ApiResponse(
                responseCode = "500", description = "Internal server error",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun updateQuests(
        @AuthenticationPrincipal userDetails: User?,
        @RequestBody request: UpdateQuestRequest,
    ): ResponseEntity<ApiResponseDTO<UserQuestsDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val quest = userQuestsRepository.findById(request.id).getOrNull() ?: throw NotFoundException()

        if(quest.target < request.current) {
            throw ServerErrorException()
        }

        quest.progress = request.current
        userQuestsRepository.save(quest)

        return ResponseEntity.ok(
            ApiResponseDTO(data = quest.toDTO())
        )
    }

    @GetMapping("/list")
    @Operation(
        summary = "List all quests",
        description = """
            [en] Get a list of all available quests.
            AccessToken is required for all of this part of endpoints on Authorization header.
            
            [ko] 사용 가능한 모든 퀘스트 목록을 가져옵니다.
            모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully retrieved quests list",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "403",
                description = "Unauthorized access",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "500",
                description = "Internal server error",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun listQuests(
        @AuthenticationPrincipal userDetails: User?,
    ): ResponseEntity<ApiResponseDTO<List<QuestsDTO>>> {
        if (userDetails == null) throw UnauthorizedException()

        val quests = questsRepository.findAll()

        return ResponseEntity.ok(
            ApiResponseDTO(data = quests.map { it.toDTO() })
        )
    }

    @GetMapping("/list/{type}")
    @Operation(
        summary = "List quests by type",
        description = """
           [en] Get a list of quests filtered by type.
           AccessToken is required for all of this part of endpoints on Authorization header.
           
           [ko] 유형별로 필터링된 퀘스트 목록을 가져옵니다.
           모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully retrieved filtered quests list",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "403",
                description = "Unauthorized access",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "500",
                description = "Internal server error",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun listQuestsWithTypes(
        @AuthenticationPrincipal userDetails: User?,
        @Schema(description = "Type of quest", example = "ACTIVITY")
        @PathVariable type: QuestType,
    ): ResponseEntity<ApiResponseDTO<List<QuestsDTO>>> {
        if (userDetails == null) throw UnauthorizedException()

        val quests = questsRepository.findAllByType(type)

        return ResponseEntity.ok(
            ApiResponseDTO(data = quests.map { it.toDTO() })
        )
    }

    @GetMapping("/list/{type}/{step}")
    @Operation(
        summary = "List quests by type and step",
        description = """
            [en] Get a list of quests filtered by type and step number.
            AccessToken is required for all of this part of endpoints on Authorization header.
            
            [ko] 유형과 단계 번호로 필터링된 퀘스트 목록을 가져옵니다.
            모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully retrieved filtered quests list",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "403",
                description = "Unauthorized access",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "500",
                description = "Internal server error",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun listQuestsWithTypes(
        @AuthenticationPrincipal userDetails: User?,
        @Schema(description = "Type of quest", example = "ACTIVITY")
        @PathVariable type: QuestType,
        @Schema(description = "Step of quest type", example = "1")
        @PathVariable step: Int,
    ): ResponseEntity<ApiResponseDTO<QuestsDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val quest = questsRepository.findByTypeAndStep(type, step).getOrNull() ?: throw NotFoundException()

        return ResponseEntity.ok(
            ApiResponseDTO(data = quest.toDTO())
        )
    }
}