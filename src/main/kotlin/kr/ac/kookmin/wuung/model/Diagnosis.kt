package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import space.mori.dalbodeule.snapadmin.external.annotations.DisableEditField
import java.time.LocalDateTime

// 약식 검사와 정식 검사 종류를 표현한 클래스
enum class DiagnosisType(val value : String) {
    Simple("Simple"),
    `PHQ-9`("PHQ-9"),
    `GAD-7`("GAD-7"),
    BDI("BDI")
}

@Entity
@Table(name = "diagnosis")
data class Diagnosis(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id : Long? = null, // 필드의 데이터를 구분지어주는 구분자

    @Enumerated(EnumType.STRING)
    var type : DiagnosisType, // 검사 종류를 나타내주는 필드

    @Column(nullable = false, length = 128)
    var title: String,

    @Column(nullable = false, length = 1024)
    var description: String,

    @Column
    var totalScore: Int = 0,

    @OneToMany
    var diagnosisQuestions: List<DiagnosisQuestions> = listOf(),

    @OneToMany
    var diagnosisScale: List<DiagnosisScale> = listOf(),

    @Column(nullable = false)
    @DisableEditField
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    @DisableEditField
    var updatedAt: LocalDateTime = LocalDateTime.now(),
) {
    constructor(): this(
        id = null,
        type = DiagnosisType.Simple,
        title = "",
        description = ""
    )

    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
        totalScore = diagnosisQuestions.sumOf { question ->
            question.diagnosisText.maxBy {
                answer -> answer.score
            }.score
        }
    }
}