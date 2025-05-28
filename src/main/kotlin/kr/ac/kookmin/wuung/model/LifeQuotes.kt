package kr.ac.kookmin.wuung.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import space.mori.dalbodeule.snapadmin.external.annotations.DisableEditField
import java.time.LocalDateTime

@Entity
@Table(name = "life_quotes")
class LifeQuotes (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    val quote: String = "",

    @DisableEditField
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @DisableEditField
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
) {
    constructor(): this(
        quote = "",
        createdAt = LocalDateTime.now(),
    )

    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}