package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "userRecord")
data class Record (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id : Long? = null,

    @Column(nullable = false)
    var original : String? = null,

    @Column(nullable = false)
    var tansformed : String? = null,

    @OneToOne
    @JoinColumn(nullable = false)
    val user: User? = null,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
) {
    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}