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
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.http.ResponseEntity
import kr.ac.kookmin.wuung.lib.ApiResponseDTO
import kr.ac.kookmin.wuung.repository.RecordRepository
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.exceptions.NotFoundException
import kr.ac.kookmin.wuung.exceptions.UnauthorizedException
import kr.ac.kookmin.wuung.lib.datetimeParser
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import java.time.LocalDate
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


@RestController
@RequestMapping("/records")
@Tag(name = "Record API", description = """
    [en] Record management endpoints
    [ko] 기록 관리 엔드포인트
""")
class RecordController(
    @Autowired private val authenticationManager: AuthenticationManager,
    @Autowired private val recordRepository: RecordRepository,
) {
    @GetMapping("/me")
    @Operation(
        summary = "[en] Get record by date\n[ko] 날짜별 기록 조회",
        description = "[en] Get a user's record for a specific date\n[ko] 특정 날짜의 사용자 기록을 조회합니다"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "[en] Successfully retrieved record\n[ko] 기록 조회 성공",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "403", description = "[en] Unauthorized access\n[ko] 권한 없음",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "404", description = "[en] Record not found\n[ko] 기록을 찾을 수 없음",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun getRecordByDate(
        @AuthenticationPrincipal userDetails: User?,
        @Schema(description = "[en] Date in format yyyy-MM-dd\n[ko] 날짜 형식 yyyy-MM-dd", example = "2025-05-01")
        @RequestParam date: String,
    ): ResponseEntity<ApiResponseDTO<RecordDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val targetDate: LocalDate = date.datetimeParser().toLocalDate()
        val startOfDay: LocalDateTime = targetDate.atStartOfDay()
        val endOfDay: LocalDateTime = targetDate.atTime(23, 59, 59)

        val records: List<Record> = recordRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startOfDay,
            endOfDay
        )

        if (records.isEmpty()) {
            throw NotFoundException()
        }

        val record = records.maxByOrNull { it.createdAt } ?: throw NotFoundException()

        return ResponseEntity.ok(ApiResponseDTO(data = record.toDTO()))
    }

    @PutMapping("/create")
    @Operation(
        summary = "[en] Create new record\n[ko] 새로운 기록 생성",
        description = "[en] Create a new record with rate and data\n[ko] 평가와 데이터로 새로운 기록을 생성합니다"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "[en] Successfully created record\n[ko] 기록 생성 성공",
                useReturnTypeSchema = true,
            ),
            ApiResponse(
                responseCode = "403",
                description = "[en] Unauthorized access\n[ko] 권한 없음",
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
    @Operation(
        summary = "[en] Modify existing record\n[ko] 기존 기록 수정",
        description = "[en] Update rate and data of an existing record\n[ko] 기존 기록의 평가와 데이터를 수정합니다"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "[en] Successfully updated record\n[ko] 기록 수정 성공",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "403",
                description = "[en] Unauthorized access\n[ko] 권한 없음",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            ),
            ApiResponse(
                responseCode = "404",
                description = "[en] Record not found\n[ko] 기록을 찾을 수 없음",
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
        record.data = request.data

        val updated = recordRepository.save(record)
        return ResponseEntity.ok(ApiResponseDTO(data = updated.toDTO()))
    }
}
