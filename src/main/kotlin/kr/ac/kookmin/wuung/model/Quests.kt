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
import space.mori.dalbodeule.snapadmin.external.annotations.DisableEditField
import java.time.LocalDateTime


@Entity(name="Quests")
@Table(name = "quests")
data class Quests(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Enumerated(EnumType.STRING)
    var type: QuestType,

    @Column(nullable = false)
    var step: Int = 0,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false, columnDefinition = "TEXT")
    var description: String,

    @Column(nullable = false)
    var target: Int = 0,

    @DisableEditField
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @DisableEditField
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
) {
    constructor(): this(
        type = QuestType.MEDITATE,
        step = 0,
        name = "",
        description = "",
        target = 0,
        createdAt = LocalDateTime.now(),
    )

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