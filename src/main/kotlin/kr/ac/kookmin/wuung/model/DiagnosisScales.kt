package kr.ac.kookmin.wuung.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "diagnosis_scales")
data class DiagnosisScale(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id : String? = null,

    @Column(nullable = false)
    var start: Int,

    @Column(nullable = false, length = 128)
    var scaleName: String,

    @Column(nullable = false, columnDefinition = "TEXT")
    var description: String
) {
    constructor(): this(
        start = 0,
        scaleName = "",
        description = "",
    )
}
