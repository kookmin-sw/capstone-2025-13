package kr.ac.kookmin.wuung.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table


@Entity
@Table(name = "quests")
data class Quests(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Enumerated(EnumType.STRING)
    var type: QuestType? = null,

    @Column(nullable = false)
    var name: String? = null,

    @Column(nullable = false, columnDefinition = "TEXT")
    var description: String? = null,

    @Column(nullable = false)
    var target: Int = 0,
)

enum class QuestType(val value: String) {
    MEDITATE("MEDITATE"),
    ACTIVITY("ACTIVITY"),
    EMOTION("EMOTION")
}