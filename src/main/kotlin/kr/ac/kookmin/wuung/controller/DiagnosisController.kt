package kr.ac.kookmin.wuung.controller

import com.fasterxml.jackson.annotation.JsonFormat
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import kr.ac.kookmin.wuung.jwt.JwtProvider
import kr.ac.kookmin.wuung.service.DiagnosisService
import kr.ac.kookmin.wuung.service.TokenService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
import java.time.OffsetDateTime

data class CreateDiagnosisRequest(
    val accessToken: String,
    val result: Long,
    val type: Long,
    val createAt: String
)

// message만 설정해놓긴 했음.
data class CreateDiagnosisResponse(val message: String)

@RestController
@RequestMapping("/daignosis")
@Tag(name = "Diagnosis API", description = "Endpoints for Diagnosis create and read data")
class DiagnosisController(
    @Autowired private val diagnosisService: DiagnosisService,
    @Autowired private val jwtProvider: JwtProvider
)
{
    @PostMapping("/create")
    @Operation()
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully create diagnosis", content = [Content(mediaType = "application/json", schema = Schema(implementation = CreateDiagnosisResponse::class))]),
            ApiResponse(responseCode = "400", description = "Failed to create diagnosis", content = [Content(mediaType = "application/json", schema = Schema(implementation = CreateDiagnosisResponse::class))])
        ]
    )
    fun createDiagnosis(@RequestBody request: CreateDiagnosisRequest): ResponseEntity<CreateDiagnosisResponse> {
        // JWT 토큰 검증
        if (!jwtProvider.validateToken(request.accessToken)) {
            return ResponseEntity.badRequest().body(CreateDiagnosisResponse("Invalid JWT"))
        }

        // 데이터 파싱
        val createAt : LocalDateTime = OffsetDateTime.parse(request.createAt).toLocalDateTime()
        // 데이터 추가
        diagnosisService.createDiagnosis(request.type, request.result, createAt)

        // 결과 반환
        return ResponseEntity.ok(CreateDiagnosisResponse("ok"))
    }
}
