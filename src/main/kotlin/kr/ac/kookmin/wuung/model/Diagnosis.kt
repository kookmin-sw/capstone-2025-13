package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import java.time.LocalDateTime

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

    @Enumerated(EnumType.STRING)
    var type : DiagnosisType? = null, // 검사 종류를 나타내주는 필드

    @Column(nullable = false, length = 128)
    var title: String? = null,

    @Column(nullable = false, length = 1024)
    var description: String? = null,

    @OneToMany
    var diagnosisQuestions: List<DiagnosisQuestions> = listOf(),

    @OneToMany
    var diagnosisScale: List<DiagnosisScale> = listOf(),

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
) {
    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}