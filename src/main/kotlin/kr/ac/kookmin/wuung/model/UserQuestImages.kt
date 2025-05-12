package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "user_quest_images")
data class UserQuestImages(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
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