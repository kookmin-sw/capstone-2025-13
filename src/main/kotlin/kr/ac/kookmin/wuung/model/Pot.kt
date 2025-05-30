package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import space.mori.dalbodeule.snapadmin.external.annotations.DisableEditField
import java.time.LocalDateTime

@Entity
@Table(name = "user_pot")
data class Pot(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @OneToOne(cascade = [CascadeType.ALL])
    val user: User,

    @Column(nullable = false)
    var exp: Int = 0,

    @Column(nullable = false)
    var level: Int = 1,

    @Column(nullable = false)
    var coupon: Int = 0,

    @DisableEditField
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @DisableEditField
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    constructor(): this(
        id = null,
        user = User(),
        exp = 0,
        level = 1,
        coupon = 0,
        createdAt = LocalDateTime.now(),
        updatedAt = LocalDateTime.now()
    )

    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}