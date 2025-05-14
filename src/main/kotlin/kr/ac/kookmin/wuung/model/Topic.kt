package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "topics")
data class Topic(
    @Id
    @GeneratedValue(strategy =  GenerationType.UUID)
    var id : String? = null,

    @Column(nullable = false)
    var rate : Int = 0,

    @Column(nullable = false, columnDefinition = "TEXT")
    var data : String,

    @Column(nullable = false)
    var innerSeq : Int = 0,

    @ManyToOne
    val user: User? = null,

    @OneToMany
    val topicFeedback: MutableList<TopicFeedback> = mutableListOf(),

    @Column(nullable = false)
    val createdAt : LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
) {
    constructor(): this(
        rate = 0,
        data = "",
        innerSeq = 0,
        user = User(),
        topicFeedback = mutableListOf(),
        createdAt = LocalDateTime.now(),
    )

    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}