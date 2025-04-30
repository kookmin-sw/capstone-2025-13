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
    var start: Int = 0,

    @Column(nullable = false, length = 32)
    var scaleName: String? = null,

    @Column(nullable = false, length = 128)
    var description: String? = null
)
