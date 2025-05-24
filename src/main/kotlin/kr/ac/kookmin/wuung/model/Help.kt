package kr.ac.kookmin.wuung.model

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import kr.ac.kookmin.wuung.controller.HelpDTO
import space.mori.dalbodeule.snapadmin.external.annotations.DisableEditField
import java.time.LocalDateTime
import java.time.LocalTime
import org.locationtech.jts.geom.*;
import java.io.Serializable

@Table(name = "help")
@Entity
data class Help (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column
    var hpCnterNm : String? = null, // 건강증진센터명

    @Column
    var hpCnterSe : String? = null, // 건강증진센터구분

    @Column
    var rdnmadr : String? = null, // 소재지도로명주소

    @Column
    var lnmadr : String? = null, // 소재지지번주소

    @Column
    var latitude : Double= 0.0, // 위도

    @Column
    var longitude : Double= 0.0, // 경도

    @JsonIgnore
    @Column(columnDefinition = "geomtery(Point, 4326)") // WGIS의 기준점
    private var location: Point? = null,

    @Column
    var hpCnterJob : String?= null, // 건강증진업무내용

    @Column
    var operOpenHhmm: LocalTime? = null, // 운영시작시간

    @Column
    var operCloseHhmm: LocalTime? = null, // 운영종료시각

    @Column
    var rstdeInfo : String? = null, // 휴무일정보

    @Column
    var hpCnterAr : Int? = null, // 건물면적

    @Column
    var doctrCo : Int? = null, // 의사수

    @Column
    var nurseCo : Int? = null, // 간호사수

    @Column
    var scrcsCo : Int? = null, // 사회복지사수

    @Column
    var ntrstCo : Int? = null, // 영양사수

    @Column
    var etcHnfSttus : String? = null, // 기타입력현황

    @Column
    var etcUseIfno : String? = null, // 기타이용안내

    @Column
    var operPhoneNumber : String? = null, // 운영기관전화번호

    @Column
    var operInstitutionNm: String? = null, // 운영기관명

    @Column
    var phoneNumber : String? = null, // 관리기관전화번호

    @Column
    var institutionNm : String? = null, // 관리기관명

    @Column
    var referenceDate : LocalDateTime? = null, // 데이터기준일자

    @Column
    var instt_code : String? = null, // 제공기관코드

    @Column
    var instt_nm : String? = null, // 제공기관기관명

    @Column(nullable = false)
    @DisableEditField
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    @DisableEditField
    var updatedAt: LocalDateTime = LocalDateTime.now(),
) : Serializable {
    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }

    @PrePersist
    @PreUpdate
    private fun updateLocation() {
            val geometryFactory = GeometryFactory()
            location = geometryFactory.createPoint(
                Coordinate(longitude!!, latitude!!)
            )
    }
}