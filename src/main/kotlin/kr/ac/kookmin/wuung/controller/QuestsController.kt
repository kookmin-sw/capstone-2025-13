package kr.ac.kookmin.wuung.controller

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import kr.ac.kookmin.wuung.model.LifeQuotes
import kr.ac.kookmin.wuung.repository.LifeQuoteRepository
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
import kr.ac.kookmin.wuung.model.UserQuestStages
import kr.ac.kookmin.wuung.model.UserQuestStatus
import kr.ac.kookmin.wuung.repository.UserQuestStageRepository
import kr.ac.kookmin.wuung.service.QuestService
import kr.ac.kookmin.wuung.service.QuestsDTO
import kr.ac.kookmin.wuung.service.UserQuestS3Service
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrNull

data class UserQuestsDTO(
    val id: String,
    val name: String,
    val description: String,
    val type: QuestType,
    val progress: Int,
    val target: Int,
    val status: UserQuestStatus,
    val step: Int,
    @JsonIgnore
    val photoSrc: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    @JsonIgnore
    private var _photoEndpoint: String = ""
    @JsonIgnore
    private var _photoBucketName: String = ""

    @get:JsonIgnore
    var photoEndpoint: String
        get() = _photoEndpoint
        set(value) {
            _photoEndpoint = value
        }
    @get:JsonIgnore
    var photoBucketName: String
        get() = _photoEndpoint
        set(value) {
            _photoBucketName = value
        }

    @get:JsonProperty("photo")
    val photo: String?
        get() {
            return if (photoSrc == null || photoSrc.isBlank() || _photoEndpoint.isBlank() || _photoBucketName.isBlank()) null
            else return "$_photoEndpoint/$_photoBucketName/$photoSrc"
        }
}

fun UserQuests.toDTO() = UserQuestsDTO(
    this.id ?: "",
    this.quest.name,
    this.quest.description,
    this.quest.type,
    this.progress,
    this.target,
    this.status,
    this.quest.step,
    this.photo,
    this.createdAt,
    this.updatedAt
)
data class CreateQuestRequest(
    val id: Long,
)
data class UpdateQuestRequest(
    val id: String,
    val current: Int,
    val status: UserQuestStatus
)

data class UserQuestStagesDTO(
    val id: Long,
    val type: QuestType,
    val stage: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

fun UserQuestStages.toDTO() = UserQuestStagesDTO(
    id = this.id ?: 0,
    type = this.type,
    stage = this.stage,
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
    @Autowired private val lifeQuoteRepository: LifeQuoteRepository,
    @Autowired private val questService: QuestService,
    @Autowired private val userQuestsRepository: UserQuestsRepository,
    @Autowired private val userQuestStageRepository: UserQuestStageRepository,
    @Autowired private val userQuestS3Service: UserQuestS3Service,
    @Value("\${s3.public-endpoint}") private val s3PublicEndpoint: String,
    @Value("\${s3.quest-bucket}") private val s3BucketName: String,
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
            ApiResponseDTO(data = quests.map {
                val dto = it.toDTO()
                dto.photoEndpoint = s3PublicEndpoint
                dto.photoBucketName = s3BucketName

                dto
            })
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

        val quest = questService.getByIdRaw(request.id) ?: throw NotFoundException()

        val data = UserQuests(
            user = userDetails,
            quest = quest,
            description = quest.description,
            progress = 0,
            target = quest.target
        )

        userQuestsRepository.save(data)

        val dto = data.toDTO()
        dto.photoEndpoint = s3PublicEndpoint
        dto.photoBucketName = s3BucketName

        return ResponseEntity.ok(
            ApiResponseDTO(data = dto)
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
        quest.status = request.status
        userQuestsRepository.save(quest)

        val questStage = userQuestStageRepository.findByUserAndType(userDetails, quest.quest.type) ?: let {
            val quest = UserQuestStages(
                user = userDetails,
                stage = 0,
                type = quest.quest.type
            )
            userQuestStageRepository.save(quest)

            return@let quest
        }

        questStage.stage += 1

        val dto = quest.toDTO()
        dto.photoEndpoint = s3PublicEndpoint
        dto.photoBucketName = s3BucketName

        return ResponseEntity.ok(
            ApiResponseDTO(data = dto)
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

        val quests = questService.getAll()

        return ResponseEntity.ok(
            ApiResponseDTO(data = quests)
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

        val quests = questService.getAllByType(type)

        return ResponseEntity.ok(
            ApiResponseDTO(data = quests)
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

        val quest = questService.getByTypeAndStep(type, step) ?: throw NotFoundException()

        return ResponseEntity.ok(
            ApiResponseDTO(data = quest )
        )
    }


    @PostMapping("/stage")
    @Operation(
        summary = "Increment all quests circular",
        description = """
        [en] Increment all quest circular by 1 for the authenticated user.
        AccessToken is required on Authorization header.
        
        [ko] 인증된 사용자의 모든 퀘스트 서큘러값을 1씩 증가시킵니다.
        Authorization 헤더에 AccessToken이 필요합니다.
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "update quest circular successfully",
                useReturnTypeSchema = true
            ),
            ApiResponse(responseCode = "403",
                description = "Unauthorized access",
                content = [Content(mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class))]),
            ApiResponse(responseCode = "500",
                description = "Internal server error",
                content = [Content(mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class))]),
        ]
    )
    fun incrementAllStages(
        @AuthenticationPrincipal userDetails: User?
    ): ResponseEntity<ApiResponseDTO<String>> {
        if (userDetails == null) throw UnauthorizedException()

        // user 찾아서
        val stages = userQuestStageRepository.findByUser(userDetails)

        // 서큘러 값 업데이트
        stages.forEach { stage ->
            stage.stage += 1
            userQuestStageRepository.save(stage)
        }

        // 그냥 성공했다고 전달만 하면 됨.
        return ResponseEntity.ok(ApiResponseDTO())
    }

    @PostMapping("/stage/{type}")
    @Operation(
        summary = "Increment quest circular specific type by 1",
        description = """
        [en] Increment quest circular count by 1 for specific type.
        AccessToken is required on Authorization header.
        
        [ko] 특정 타입의 퀘스트 서큘러 값을 1 증가시킵니다.
        Authorization 헤더에 AccessToken이 필요합니다.
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "update quest circular successfully",
                useReturnTypeSchema = true),
            ApiResponse(
                responseCode = "403",
                description = "Unauthorized access",
                content = [Content(mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class))]),
            ApiResponse(
                responseCode = "404",
                description = "Stage not found",
                content = [Content(mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class))]),
            ApiResponse(
                responseCode = "500",
                description = "Internal server error",
                content = [Content(mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class))]),
        ]
    )
    fun incrementStageByType(
        @AuthenticationPrincipal userDetails: User?,
        @PathVariable type: QuestType
    ): ResponseEntity<ApiResponseDTO<String>> {
        if (userDetails == null) throw UnauthorizedException()

        // 스테이지 값 찾고
        val stage = userQuestStageRepository.findByUserAndType(userDetails, type)
            ?: throw NotFoundException()

        // 업데이트 및 저장
        stage.stage += 1
        userQuestStageRepository.save(stage)

        // 반환
        return ResponseEntity.ok(ApiResponseDTO())
    }

    @GetMapping("/stage")
    @Operation(
        summary = "Get quest stages",
        description = """
            [en] Get all quest stages for the authenticated user.
            AccessToken is required on Authorization header.

            [ko] 인증된 사용자의 모든 퀘스트 스테이지를 가져옵니다.
            Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully retrieved quest stages",
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
    fun getQuestStages(
        @AuthenticationPrincipal userDetails: User?
    ): ResponseEntity<ApiResponseDTO<List<UserQuestStagesDTO>>> {
        if (userDetails == null) throw UnauthorizedException()

        val stages = userQuestStageRepository.findByUser(userDetails).map { it.toDTO() }
        return ResponseEntity.ok(ApiResponseDTO(data = stages))
    }

    @GetMapping("/stage/{type}")
    @Operation(
        summary = "Get quest stage by type",
        description = """
            [en] Get quest stage for specific type.
            AccessToken is required on Authorization header.
            
            [ko] 특정 타입의 퀘스트 스테이지를 가져옵니다.
            Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully retrieved quest stage",
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
                responseCode = "404",
                description = "Quest stage not found",
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
    fun getQuestStageByType(
        @AuthenticationPrincipal userDetails: User?,
        @PathVariable type: QuestType
    ): ResponseEntity<ApiResponseDTO<Int>> {
        if (userDetails == null) throw UnauthorizedException()

        val stage = userQuestStageRepository.findByUserAndType(userDetails, type)
            ?.stage

        return ResponseEntity.ok(ApiResponseDTO(data = stage))
    }

    // 부 스테이지 관련 API
    @GetMapping("/last")
    @Operation(
        summary = "Get current quests",
        description = """
            [en] Get all current quests in progress.
            AccessToken is required on Authorization header.
            
            [ko] 현재 진행 중인 모든 퀘스트를 가져옵니다.
            Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully retrieved current quests",
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
    fun getCurrentQuests(
        @AuthenticationPrincipal userDetails: User?
    ): ResponseEntity<ApiResponseDTO<Map<QuestType, UserQuestsDTO>>> {
        if (userDetails == null) throw UnauthorizedException()

        val questMaps = userQuestsRepository.findByUser(userDetails)
            .filter { it.status == UserQuestStatus.PROCESSING || it.status == UserQuestStatus.COMPLETED }
            .groupBy { it.quest.type }
            .mapValues { (_, quests) ->
                quests.maxByOrNull { it.createdAt }?.let { lastQuest ->
                    val dto = lastQuest.toDTO()
                    dto.photoEndpoint = s3PublicEndpoint
                    dto.photoBucketName = s3BucketName

                    dto
                }
            }
            .filterValues { it != null }
            .mapValues { it.value!! }

        return ResponseEntity.ok(ApiResponseDTO(data = questMaps))
    }

    @GetMapping("/last/{type}")
    @Operation(
        summary = "Get current quest by type",
        description = """
            [en] Get current quest in progress for specific type.
            AccessToken is required on Authorization header.
            
            [ko] 특정 타입의 현재 진행 중인 퀘스트를 가져옵니다.
            Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully retrieved current quest",
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
                responseCode = "404",
                description = "No current quest found for given type",
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
    fun getCurrentQuestByType(
        @AuthenticationPrincipal userDetails: User?,
        @PathVariable type: QuestType
    ): ResponseEntity<ApiResponseDTO<UserQuestsDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val quest = userQuestsRepository.findByUser(userDetails)
            .filter { it.quest.type == type && (it.status == UserQuestStatus.PROCESSING || it.status == UserQuestStatus.COMPLETED) }
            .maxByOrNull { it.createdAt }
            ?: throw NotFoundException()

        val dto = quest.toDTO()
        dto.photoEndpoint = s3PublicEndpoint
        dto.photoBucketName = s3BucketName

        return ResponseEntity.ok(ApiResponseDTO(data = dto))
    }

    @PutMapping(
        "/photo/{userQuestID}",
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE],
        produces = [MediaType.APPLICATION_JSON_VALUE]
    )
    @Operation(
        summary = "Upload quest photo",
        description = """
            [en] Upload a photo for a specific quest.
            AccessToken is required on Authorization header.
            
            [ko] 특정 퀘스트에 사진을 업로드합니다.
            Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully uploaded photo",
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
                responseCode = "404",
                description = "Quest not found",
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
    fun uploadQuestPhoto(
        @AuthenticationPrincipal userDetails: User?,
        @PathVariable userQuestID: String,
        @RequestParam("file") file: MultipartFile,
    ): ResponseEntity<ApiResponseDTO<UserQuestsDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val userQuests = userQuestsRepository.findById(userQuestID).getOrNull() ?: throw NotFoundException()
        if (userQuests.user.id != userDetails.id) throw UnauthorizedException()

        val file = userQuestS3Service.uploadPhoto(userQuests, file)

        userQuests.photo = file
        userQuestsRepository.save(userQuests)

        val dto = userQuests.toDTO()
        dto.photoEndpoint = s3PublicEndpoint
        dto.photoBucketName = s3BucketName

        return ResponseEntity.ok(ApiResponseDTO(data = dto))
    }

    @DeleteMapping("/photo/{userQuestID}")
    @Operation(
        summary = "Delete quest photo",
        description = """
            [en] Delete the photo of a specific quest.
            AccessToken is required on Authorization header.
            
            [ko] 특정 퀘스트의 사진을 삭제합니다.
            Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully deleted photo",
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
                responseCode = "404",
                description = "Quest not found",
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
    fun deleteQuestPhoto(
        @AuthenticationPrincipal userDetails: User?,
        @PathVariable userQuestID: String,
    ): ResponseEntity<ApiResponseDTO<UserQuestsDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val userQuests = userQuestsRepository.findById(userQuestID).getOrNull() ?: throw NotFoundException()
        if (userQuests.user.id != userDetails.id) throw UnauthorizedException()

        userQuestS3Service.removePhoto(userQuests)

        userQuests.photo = null
        userQuestsRepository.save(userQuests)

        val dto = userQuests.toDTO()
        dto.photoEndpoint = s3PublicEndpoint
        dto.photoBucketName = s3BucketName

        return ResponseEntity.ok(ApiResponseDTO(data = dto))
    }

    @GetMapping("/quote")
    @Operation(
        summary = "Get random life quote",
        description = """
            [en] Get a random life quote from the database.
            AccessToken is required on Authorization header.
            
            [ko] 데이터베이스에서 랜덤한 명언을 조회합니다.
            Authorization 헤더에 AccessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "return life quotes successfully",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "403",
                description = "Unauthorized access",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun getRandomQuote(
        @AuthenticationPrincipal userDetails: User?
    ): ResponseEntity<ApiResponseDTO<String>> {
        if (userDetails == null) throw UnauthorizedException()
        val quotes = lifeQuoteRepository.findAll()
        val randomQuote = quotes.random()
        return ResponseEntity.ok(ApiResponseDTO(data = randomQuote.quote))
    }
}
