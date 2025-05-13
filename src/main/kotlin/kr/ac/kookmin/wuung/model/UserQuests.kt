package kr.ac.kookmin.wuung.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
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
    var user: User? = null,

    @ManyToOne
    var quest: Quests? = null,

    @Column(nullable = false, columnDefinition = "TEXT")
    var description: String? = null,

    @Column(nullable = false)
    var progress: Int = 0,

    @Column(nullable = false)
    var target: Int = 0,

    @Column(nullable = false)
    var status : UserQuestStatus = UserQuestStatus.INCOMPLETE,

    @Column(nullable = true)
    var photo: String? = null,

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