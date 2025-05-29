package kr.ac.kookmin.wuung.service

import kr.ac.kookmin.wuung.model.Help
import kr.ac.kookmin.wuung.repository.HelpCenterRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.io.Serializable
import java.time.LocalDateTime
import java.time.LocalTime

data class HelpDTO (
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
) : Serializable {}

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
private fun Help.toHelpDTO() = HelpDTO(
    hpCnterNm,
    hpCnterSe,
    rdnmadr,
    lnmadr,
    latitude,
    longitude,
    hpCnterJob,
    operOpenHhmm,
    operCloseHhmm,
    rstdeInfo,
    hpCnterAr,
    doctrCo,
    nurseCo,
    scrcsCo,
    ntrstCo,
    etcHnfSttus,
    etcUseIfno,
    operPhoneNumber,
    operInstitutionNm,
    phoneNumber,
    institutionNm,
    referenceDate,
    instt_code,
    instt_nm
)


@Service
class HelpCenterService(
    @Autowired private val helpCenterRepository: HelpCenterRepository
) {
    private companion object {
        const val DEFAULT_DISTANCE_METERS = 1000
    }

    @Cacheable(
        value = ["centerCache"],
        key = "'center_' + #latitude + '_' + #longitude + '_distance_' + #distance",
    )
    fun getCenters(latitude: Double, longitude: Double, distance: Int = DEFAULT_DISTANCE_METERS): List<HelpDTO> {
        println("${latitude}/${longitude}/${distance}")
        val nearbyHelps = helpCenterRepository.findNearbyHelp(
            latitude, longitude, DEFAULT_DISTANCE_METERS
        )
        val helpDTOs = nearbyHelps.map { it.toHelpDTO() }

        return helpDTOs
    }
}