package kr.ac.kookmin.wuung.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table

@Entity
@Table(name = "diagnosis_questions")
class DiagnosisQuestions(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id : String? = null, // 필드의 데이터를 구분지어주는 구분자

    @Column(nullable = false)
    var seq : Int,

    @Column(nullable = false)
    var text : String, // 검사 지문을 나타내주는 필드

    @OneToMany
    var diagnosisText : List<DiagnosisText> = listOf()
) {
    constructor(): this(
        seq = 0,
        text = "",
        diagnosisText = listOf()
    )
}