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
import kr.ac.kookmin.wuung.repository.HelpCenterRepository
import kr.ac.kookmin.wuung.service.RedisService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
import java.time.LocalTime
import kotlin.String

data class HospitalRequest (
    val latitude : Double,
    val longitude : Double
)

data class HelpDTO(
    val hpCnterNm : String? = null, // 건강증진센터명
    val hpCnterSe : String? = null, // 건강증진센터구분
    val rdnmadr : String? = null, // 소재지도로명주소
    val lnmadr : String? = null, // 소재지지번주소
    val latitude : Double= 0.0, // 위도
    val longitude : Double= 0.0, // 경도
    val hpCnterJob : String?= null, // 건강증진업무내용
    val operOpenHhmm: LocalTime? = null, // 운영시작시간
    val operCloseHhmm: LocalTime? = null, // 운영종료시각
    val rstdeInfo : String? = null, // 휴무일정보
    val hpCnterAr : Int? = null, // 건물면적
    val doctrCo : Int? = null, // 의사수
    val nurseCo : Int? = null, // 간호사수
    val scrcsCo : Int? = null, // 사회복지사수
    val ntrstCo : Int? = null, // 영양사수
    val etcHnfSttus : String? = null, // 기타입력현황
    val etcUseIfno : String? = null, // 기타이용안내
    val operPhoneNumber : String? = null, // 운영기관전화번호
    val operInstitutionNm: String? = null, // 운영기관명
    val phoneNumber : String? = null, // 관리기관전화번호
    val institutionNm : String? = null, // 관리기관명
    val referenceDate : LocalDateTime? = null, // 데이터기준일자
    val instt_code : String? = null, // 제공기관코드
    val instt_nm : String? = null, // 제공기관기관명
)

fun HelpDTO.toDTO() = HelpDTO(
    this.hpCnterNm,  // 건강증진센터명
    this.hpCnterSe, // 건강증진센터구분
    this.rdnmadr, // 소재지도로명주소
    this.lnmadr, // 소재지지번주소
    this.latitude, // 위도
    this.longitude, // 경도
    this.hpCnterJob, // 건강증진업무내용
    this.operOpenHhmm, // 운영시작시간
    this.operCloseHhmm, // 운영종료시각
    this.rstdeInfo, // 휴무일정보
    this.hpCnterAr, // 건물면적
    this.doctrCo, // 의사수
    this.nurseCo, // 간호사수
    this.scrcsCo, // 사회복지사수
    this.ntrstCo, // 영양사수
    this.etcHnfSttus, // 기타입력현황
    this.etcUseIfno, // 기타이용안내
    this.operPhoneNumber, // 운영기관전화번호
    this.operInstitutionNm, // 운영기관명
    this.phoneNumber, // 관리기관전화번호
    this.institutionNm, // 관리기관명
    this.referenceDate, // 데이터기준일자
    this.instt_code, // 제공기관코드
    this.instt_nm, // 제공기관기관명
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
    @Autowired private val helpRepository: HelpCenterRepository,
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
    @Cacheable(key = "#latitude+'_'+#longitude", value = ["helps"])
    fun getHospitalInformationByPoint(
        @AuthenticationPrincipal userDetails: User?,
        @RequestParam latitude : Double,
        @RequestParam longitude : Double
    ): ResponseEntity<ApiResponseDTO<List<HelpDTO>>> {
        if (userDetails == null) throw UnauthorizedException()

        val helps = helpRepository.findNearbyHelp(latitude, longitude, 1000.0)

        // 반환
        return ResponseEntity.ok(
            ApiResponseDTO(
                data = helps.map {
                    HelpDTO(
                        it.hpCnterNm,
                        it.hpCnterSe,
                        it.rdnmadr,
                        it.lnmadr,
                        it.latitude,
                        it.longitude,
                        it.hpCnterJob,
                        it.operOpenHhmm,
                        it.operCloseHhmm,
                        it.rstdeInfo,
                        it.hpCnterAr,
                        it.doctrCo,
                        it.nurseCo,
                        it.scrcsCo,
                        it.ntrstCo,
                        it.etcHnfSttus,
                        it.etcUseIfno,
                        it.operPhoneNumber,
                        it.operInstitutionNm,
                        it.phoneNumber,
                        it.institutionNm,
                        it.referenceDate,
                        it.instt_code,
                        it.instt_nm
                    )
                }
            )
        )
    }
}