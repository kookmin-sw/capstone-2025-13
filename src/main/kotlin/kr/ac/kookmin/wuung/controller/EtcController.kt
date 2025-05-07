package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import io.swagger.v3.oas.annotations.media.Schema
import kr.ac.kookmin.wuung.exceptions.JwtExpiredException
import kr.ac.kookmin.wuung.exceptions.UnauthorizedException
import kr.ac.kookmin.wuung.lib.ApiResponseDTO
import kr.ac.kookmin.wuung.lib.datetimeParser
import kr.ac.kookmin.wuung.model.DiagnosisType
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.repository.DiagnosisResultsRepository
import kr.ac.kookmin.wuung.service.DiagnosisService
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
@Tag(name = "etc API", description = """
    [En] Support convenience for Front End Side
    AccessToken is required for all of this part of endpoints on Authorization header.
    [Kr] 프론트 엔드를 위한 편의성 지원용 API
    해당 API를 사용하기 위해서는 Authorization 헤더에 AccessToken을 명시해야합니다.
""")
class EtcController(
    @Autowired private val diagnosisResultsRepository: DiagnosisResultsRepository
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
    ): ResponseEntity<ApiResponseDTO<List<String>>> {

        if (userDetails == null) throw UnauthorizedException()

        val startDate = date.datetimeParser()
        val endDate = startDate.plusDays(1)

        val diagnosis = diagnosisResultsRepository.findByUserAndCreatedAtBetween(
            userDetails,
            startDate,
            endDate
        )

        var behaviors: List<String> = diagnosis.map { result ->
            when (result.diagnosis?.type) {
                DiagnosisType.PHQ_9 -> "PHQ-9 검사 시행"
                DiagnosisType.BDI -> "BDI 검사 시행"
                DiagnosisType.Simple -> "약식 검사 시행"
                else -> ""
            }
        }.filter { it.isNotEmpty() }

        behaviors = behaviors + ""
        
        return ResponseEntity.ok(
            ApiResponseDTO(
                data = behaviors
            )
        )
    }
}