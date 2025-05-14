package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "revoked_token", uniqueConstraints = [UniqueConstraint(columnNames = ["token"])])
data class RevokedToken(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true, length = 2048)
    val token: String,

    @Column(name = "revoked_at", nullable = false)
    val revokedAt: LocalDateTime = LocalDateTime.now(),
) {
    constructor(token: String) : this(
        token = token,
        revokedAt = LocalDateTime.now(),
    )
}