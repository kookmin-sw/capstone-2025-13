package kr.ac.kookmin.wuung.config.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import kr.ac.kookmin.wuung.jwt.JwtProvider
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.service.DiagnosisTextService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.lang.Exception

data class ReadDiagnosisTextRequest(
    val type: String
)

@RestController
@RequestMapping("/daignosisText")
@Tag(name = "Diagnosis Text API", description = "Endpoints for read diagnosis text")
class DiagnosisTextController(
    @Autowired val diagnosisTextService: DiagnosisTextService,
    @Autowired private val jwtProvider: JwtProvider
) {
    @PostMapping("/read")
    @Operation(summary = "read diagnosis text list", description = "read diagnosis text list specific type")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully read diagnosis text", content = [Content(mediaType = "application/json", schema = Schema(implementation = Object::class))]),
            ApiResponse(responseCode = "400", description = "Failed to read diagnosis text", content = [Content(mediaType = "application/json", schema = Schema(implementation = Exception::class))])
        ]
    )
    fun readDiagnosisText(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "access token to read diagnosis text")
        @RequestBody readDiagnosisTextRequest: ReadDiagnosisTextRequest,
        @AuthenticationPrincipal userDetails: User?
    ): ResponseEntity<Any> {
        if(userDetails == null)
            return ResponseEntity.badRequest().body("Invalid JWT")

        val type = readDiagnosisTextRequest.type

        // type 값이 비어있거나 공백인 경우 처리
        if (type.isBlank()) {
            return ResponseEntity.badRequest().body("type must not be blank")
        }

        // 지정한 type에 해당하는 검사 지문 리스트 조회
        val texts = diagnosisTextService.getDiagnosisTextStrings(type)
        if (texts.isEmpty()) {
            return ResponseEntity.badRequest().body("type not exist")
        }

        // 검사 지문 리스트를 하나의 문자열로 결합하여 반환 (개행 문자로 구분)
        return ResponseEntity.ok(mapOf("result" to texts))
    }
}