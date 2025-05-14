
package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "pot_level")
data class PotLevel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, unique = true)
    var level: Int = 1,

    @Column(nullable = false)
    var need: Int = 0,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {

    constructor(): this(
        id = null,
        level = 1,
        need = 0,
        createdAt = LocalDateTime.now(),
        updatedAt = LocalDateTime.now()
    )

    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}