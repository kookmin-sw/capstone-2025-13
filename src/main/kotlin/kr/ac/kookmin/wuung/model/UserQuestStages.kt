package kr.ac.kookmin.wuung.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import space.mori.dalbodeule.snapadmin.external.annotations.HiddenEditForm
import java.time.LocalDateTime

@Entity
@Table(name = "user_quest_stage")
data class UserQuestStages(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long? = null,

        @ManyToOne
        var user: User,

        @Column(nullable = false)
        var stage: Int = 1,

        @Enumerated
        var type: QuestType,

        @HiddenEditForm
        @Column(nullable = false)
        val createdAt: LocalDateTime = LocalDateTime.now(),

        @HiddenEditForm
        @Column(nullable = false)
        var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    constructor(): this(
            id = null,
            user = User(),
            stage = 1,
            type = QuestType.MEDITATE,
    )
    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}

