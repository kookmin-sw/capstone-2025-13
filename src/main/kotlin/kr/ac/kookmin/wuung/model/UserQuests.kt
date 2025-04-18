package kr.ac.kookmin.wuung.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

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
)
