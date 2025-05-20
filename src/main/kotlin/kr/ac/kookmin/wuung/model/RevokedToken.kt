package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import space.mori.dalbodeule.snapadmin.external.annotations.DisableCreate
import space.mori.dalbodeule.snapadmin.external.annotations.DisableDelete
import space.mori.dalbodeule.snapadmin.external.annotations.DisableEditField
import java.time.LocalDateTime

@Entity
@Table(name = "revoked_token", uniqueConstraints = [UniqueConstraint(columnNames = ["token"])])
@DisableDelete
@DisableCreate
data class RevokedToken(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @DisableEditField
    @Column(nullable = false, unique = true, length = 2048)
    val token: String,

    @DisableEditField
    @Column(name = "revoked_at", nullable = false)
    val revokedAt: LocalDateTime = LocalDateTime.now(),
) {
    constructor(token: String) : this(
        token = token,
        revokedAt = LocalDateTime.now(),
    )
}