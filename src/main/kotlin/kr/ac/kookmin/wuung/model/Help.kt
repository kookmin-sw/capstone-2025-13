package kr.ac.kookmin.wuung.model

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import space.mori.dalbodeule.snapadmin.external.annotations.DisableEditField
import java.time.LocalDateTime
import java.time.LocalTime
import org.locationtech.jts.geom.*
import java.io.Serializable

@Entity
@Table(name = "help_center")
data class Help (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column
    var hpCnterNm : String, // 건강증진센터명

    @Column
    var hpCnterSe : String, // 건강증진센터구분

    @Column
    var rdnmadr : String, // 소재지도로명주소

    @Column
    var lnmadr : String, // 소재지지번주소

    @Column
    var latitude : Double= 0.0, // 위도

    @Column
    var longitude : Double= 0.0, // 경도

    @JsonIgnore
    @Column(columnDefinition = "geometry(Point, 4326)") // WGIS의 기준점
    private var location: Point,

    @Column
    var hpCnterJob : String, // 건강증진업무내용

    @Column
    var operOpenHhmm: LocalTime, // 운영시작시간

    @Column
    var operCloseHhmm: LocalTime, // 운영종료시각

    @Column
    var rstdeInfo : String, // 휴무일정보

    @Column
    var hpCnterAr : Int?, // 건물면적

    @Column
    var doctrCo : Int?, // 의사수

    @Column
    var nurseCo : Int?, // 간호사수

    @Column
    var scrcsCo : Int?, // 사회복지사수

    @Column
    var ntrstCo : Int?, // 영양사수

    @Column
    var etcHnfSttus : String, // 기타입력현황

    @Column
    var etcUseIfno : String, // 기타이용안내

    @Column
    var operPhoneNumber : String, // 운영기관전화번호

    @Column
    var operInstitutionNm: String, // 운영기관명

    @Column
    var phoneNumber : String, // 관리기관전화번호

    @Column
    var institutionNm : String, // 관리기관명

    @Column
    var referenceDate : LocalDateTime, // 데이터기준일자

    @Column
    var instt_code : String, // 제공기관코드

    @Column
    var instt_nm : String, // 제공기관기관명

    @Column(nullable = false)
    @DisableEditField
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    @DisableEditField
    var updatedAt: LocalDateTime = LocalDateTime.now(),
) : Serializable {
    constructor() : this(
        id = null,
        hpCnterNm = "",
        hpCnterSe = "",
        rdnmadr = "",
        lnmadr = "",
        latitude = 0.0,
        longitude = 0.0,
        location = GeometryFactory().createPoint(Coordinate(0.0, 0.0)),
        hpCnterJob = "",
        operOpenHhmm = LocalTime.now(),
        operCloseHhmm = LocalTime.now(),
        rstdeInfo = "",
        hpCnterAr = 0,
        doctrCo = 0,
        nurseCo = 0,
        scrcsCo = 0,
        ntrstCo = 0,
        etcHnfSttus = "",
        etcUseIfno = "",
        operPhoneNumber = "",
        operInstitutionNm = "",
        phoneNumber = "",
        institutionNm = "",
        referenceDate = LocalDateTime.now(),
        instt_code = "",
        instt_nm = "",
        createdAt = LocalDateTime.now(),
        updatedAt = LocalDateTime.now(),
    )

    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()

        val geometryFactory = GeometryFactory()
        location = geometryFactory.createPoint(
            Coordinate(longitude, latitude)
        )
    }
}