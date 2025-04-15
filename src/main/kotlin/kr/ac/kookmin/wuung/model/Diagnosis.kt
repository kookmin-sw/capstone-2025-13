package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import kr.ac.kookmin.wuung.controller.CreateDiagnosisResponse
import org.springframework.cglib.core.Local
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter

// 약식 검사와 정식 검사 종류를 표현한 클래스
enum class DiagnosisType {
    SimpleDiagnosis,
    PHQ_9,
    BDI;
    
    // enum을 정수로 변환
    fun toInt() : Int = this.ordinal

    // 정수를 enu으로 변환
    companion object {
        // 정수 값을 받아서 해당하는 DiagnosisType을 반환. 범위를 벗어나면 null 반환
        fun fromInt(value: Int): DiagnosisType? =
            if (value in 0 until entries.size) entries[value] else null
    }
}

@Entity
@Table(name = "Diagnosis")
data class Diagnosis(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id : Long? = null, // 필드의 데이터를 구분지어주는 구분자

    @Column(nullable = false)
    var type : Long? = null, // 검사 종류를 나타내주는 필드

    @Column(nullable = false)
    var result : Long? = null, // 검사 결과를 나타내주는 필드

    @Column(nullable = false)
    var createAt : LocalDateTime? = null, // 검사 시간을 나타내주는 필드

) {
}