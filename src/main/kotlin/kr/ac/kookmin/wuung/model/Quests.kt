package kr.ac.kookmin.wuung.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import java.time.LocalDateTime


@Entity
@Table(name = "quests")
data class Quests(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Enumerated(EnumType.STRING)
    var type: QuestType? = null,

    @Column(nullable = false)
    var step: Int = 0,

    @Column(nullable = false)
    var name: String? = null,

    @Column(nullable = false, columnDefinition = "TEXT")
    var description: String? = null,

    @Column(nullable = false)
    var target: Int = 0,

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

enum class QuestType(val value: String) {
    MEDITATE("MEDITATE"),
    ACTIVITY("ACTIVITY"),
    EMOTION("EMOTION")
}