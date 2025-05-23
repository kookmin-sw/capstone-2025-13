package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "diagnosis_text")
data class DiagnosisText(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id : String? = null, // 필드의 데이터를 구분지어주는 구분자
    
    @Column(nullable = false)
    var text : String, // 검사 지문을 나타내주는 필드

    @Column(nullable = false)
    var score: Int
) {
    constructor(): this(
        text = "",
        score = 0,
    )
}