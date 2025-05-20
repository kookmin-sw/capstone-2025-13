package kr.ac.kookmin.wuung.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import space.mori.dalbodeule.snapadmin.external.annotations.DisableCreate
import space.mori.dalbodeule.snapadmin.external.annotations.DisableDelete
import space.mori.dalbodeule.snapadmin.external.annotations.DisableEditField
import java.time.LocalDateTime

enum class IntegrityChallengeStatus(val value: Int) {
    PENDING(0),
    COMPLETED(1),
    EXPIRED(2)
}

@Entity
@Table(name = "integrity_challenges")
@DisableCreate
@DisableDelete
data class IntegrityChallenge(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @Column(nullable = false)
    val challenge: String,

    @Column(nullable = false)
    val deviceId: String,

    @DisableEditField
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @DisableEditField
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    val expiresAt: LocalDateTime,

    @Enumerated
    var status: IntegrityChallengeStatus = IntegrityChallengeStatus.PENDING
) {
    constructor(): this(
        challenge = "",
        deviceId = "",
        createdAt = LocalDateTime.now(),
        updatedAt = LocalDateTime.now(),
        expiresAt = LocalDateTime.now(),
        status = IntegrityChallengeStatus.PENDING,
    )

    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}