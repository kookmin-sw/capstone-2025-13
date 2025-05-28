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

enum class TopicFeedbackStatus(val value: Short) {
    QUEUED(0),
    PROCESSING(1),
    COMPLETED(2),
    NOFEEDBACK(3),
    PROCESSING_ERROR(10)
}

@Entity
@Table(name = "topic_feedback")
data class TopicFeedback(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null,

    @Enumerated(EnumType.ORDINAL)
    var status: TopicFeedbackStatus = TopicFeedbackStatus.QUEUED,

    @Column(nullable = true, columnDefinition = "TEXT")
    var aiFeedback: String? = null,

    @Column(nullable = true, columnDefinition = "TEXT")
    var data: String,

    @Column(nullable = true, columnDefinition = "TEXT")
    var comment : String? = null,

    @ManyToOne
    val topic: Topic,

    @HiddenEditForm
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @HiddenEditForm
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
) {
    constructor(): this(
        id = null,
        status = TopicFeedbackStatus.QUEUED,
        data = "",
        topic = Topic(),
        createdAt = LocalDateTime.now(),
    )

    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}
