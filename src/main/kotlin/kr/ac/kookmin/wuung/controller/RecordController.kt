package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import kr.ac.kookmin.wuung.model.Record
import kr.ac.kookmin.wuung.service.RecordService
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
import java.time.LocalDate

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

@RestController
@RequestMapping("/records")
@Tag(name = "Record API", description = "Endpoints for records")
class RecordController(
    @Autowired private val authenticationManager: AuthenticationManager,
    @Autowired private val recordRepository : RecordRepository
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

        // 가장 최신 생성 레코드 선택
        val record = records
            .maxByOrNull { it.createdAt }
            ?: throw NotFoundException()

        return ResponseEntity.ok(ApiResponseDTO(data = record.toDTO()))
    }


}