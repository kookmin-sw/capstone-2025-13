package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "revoked_token", uniqueConstraints = [UniqueConstraint(columnNames = ["token"])])
data class RevokedToken(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    val token: String? = null,

    @Column(name = "revoked_at", nullable = false)
    val revokedAt: LocalDateTime = LocalDateTime.now()
)