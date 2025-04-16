package kr.ac.kookmin.wuung.model

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.persistence.*
import kr.ac.kookmin.wuung.controller.CreateDiagnosisResponse
import org.springframework.cglib.core.Local
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter

// 약식 검사와 정식 검사 종류를 표현한 클래스
enum class DiagnosisType(val value : String) {
    Simple("Simple"),
    PHQ_9("PHQ-9"),
    BDI("BDI")
}

@Entity
@Table(name = "Diagnosis")
data class Diagnosis(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id : Long? = null, // 필드의 데이터를 구분지어주는 구분자

    @Column(nullable = false)
    var type : String? = null, // 검사 종류를 나타내주는 필드

    @Column(nullable = false)
    var result : Long? = null, // 검사 결과를 나타내주는 필드

    @Column(nullable = false)
    var createAt : LocalDateTime? = null, // 검사 시간을 나타내주는 필드

) {
}