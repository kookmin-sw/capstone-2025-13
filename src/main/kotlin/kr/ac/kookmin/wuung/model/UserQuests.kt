package kr.ac.kookmin.wuung.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import space.mori.dalbodeule.snapadmin.external.annotations.HiddenEditForm
import java.time.LocalDateTime

enum class UserQuestStatus(val value : String) {
    COMPLETED("COMPLETED"), // 사용자가 퀘스트를 만든 상태
    INCOMPLETE("INCOMPLETE"), // 사용자가 퀘스트를 수행하지 않은 상태, 초기값
    PROCESSING("PROCESSING"), // 사용자가 퀘스트를 진행 중인 상태,
}


@Entity
@Table(name = "user_quests")
data class UserQuests(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null,

    @ManyToOne
    var user: User,

    @ManyToOne
    var quest: Quests,

    @Column(nullable = false, columnDefinition = "TEXT")
    var description: String,

    @Column(nullable = false)
    var progress: Int = 0,

    @Column(nullable = false)
    var target: Int = 0,

    @Enumerated(EnumType.ORDINAL)
    var status : UserQuestStatus = UserQuestStatus.INCOMPLETE,

    @Column(nullable = true)
    var photo: String? = null,

    @HiddenEditForm
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @HiddenEditForm
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
) {
    constructor(): this(
        id = null,
        user = User(),
        quest = Quests(),
        description = "",
        progress = 0,
        target = 0,
        status = UserQuestStatus.INCOMPLETE,
        photo = null,
        createdAt = LocalDateTime.now(),
    )
    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}