package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "DiagnosisText")
data class DiagnosisText(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id : Long? = null, // 필드의 데이터를 구분지어주는 구분자

    @Column(nullable = false)
    var type : String? = null, // 검사 종류를 나타내주는 필드
    
    @Column(nullable = false)
    var text : String? = null, // 검사 지문을 나타내주는 필드

) {
}