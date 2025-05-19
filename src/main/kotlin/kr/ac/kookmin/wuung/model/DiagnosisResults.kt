package kr.ac.kookmin.wuung.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(name = "diagnosis_results")
data class DiagnosisResults(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null,

    @ManyToOne
    var user: User,

    @ManyToOne
    var diagnosis: Diagnosis,

    @Column(nullable = false)
    var result: Int,

    @Column(nullable = false)
    var scale: Int,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
) {
    constructor(): this(
        id = null,
        user = User(),
        diagnosis = Diagnosis(),
        result = 0,
        scale = 0,
    )

    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}

