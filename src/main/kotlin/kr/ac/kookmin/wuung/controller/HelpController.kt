package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import kr.ac.kookmin.wuung.exceptions.UnauthorizedException
import kr.ac.kookmin.wuung.lib.ApiResponseDTO
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.service.HelpCenterService
import kr.ac.kookmin.wuung.service.HelpDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import kotlin.math.roundToInt


data class HospitalRequest (
    val latitude : Double,
    val longitude : Double
)

@RestController
@RequestMapping("/help")
@Tag(
    name = "Help API", description = """
    [En] This API is used to retrieve information about nearby hospitals based on the user's location.
    AccessToken is required for all of this part of endpoints on Authorization header.
    [Kr] 사용자의 위치를 기반으로 주변의 병원의 정보를 받아오기 위해서 서용하는 API입니다.
    해당 API를 사용하기 위해서는 Authorization 헤더에 AccessToken을 명시해야합니다.
"""
)
class HelpController(
    @Autowired private val helpCenterService: HelpCenterService,
) {

    @GetMapping("/hospital")
    @Operation(
        summary = "[En] Get This API is used to retrieve information about nearby hospitals based on the user's location. / [Kr] 사용자 주변의 1km 이내에 있는 병원의 정보 조회",
        description = """
            [En] Get This API is used to retrieve information about nearby hospitals based on the user's location.
            The date parameter should be latitude, longitude.
            [Kr] 사용자 주변의 1km 이내에 있는 병원의 정보 조회했습니다.
            사용자의 위치는 위도, 경도가 제공되어야 합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = """
                    [En] Successfully retrieved hospitals information
                    [Kr] 1km 이내에 존재하는 병원의 위치를 성공적으로 조회했습니다.
                """,
                useReturnTypeSchema = true,
            ),
            ApiResponse(
                responseCode = "403",
                description = """
                    [En] Unauthorized access - Valid authentication token required
                    [Kr] 인증되지 않은 접근 - 유효한 인증 토큰이 필요합니다
                """,
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ApiResponseDTO::class)
                )]
            )
        ]
    )
    fun getHospitalInformationByPoint(
        @AuthenticationPrincipal userDetails: User?,
        @RequestParam latitude: Double,
        @RequestParam longitude: Double,
        @RequestParam distance: Double = 1000.0,
    ): ResponseEntity<ApiResponseDTO<List<HelpDTO>>> {
        if (userDetails == null) throw UnauthorizedException()

        val scaledLatitude = (latitude * 10000.0).roundToInt() / 10000.0
        val scaledLongitude = (longitude * 10000.0).roundToInt() / 10000.0

        return ResponseEntity.ok(
            ApiResponseDTO(
                data =
                    helpCenterService.getCenters(scaledLatitude, scaledLongitude, distance)
            ))
    }
}