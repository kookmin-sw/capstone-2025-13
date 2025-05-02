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

enum class RecordFeedbackStatus(val value: Short) {
    QUEUED(0),
    PROCESSING(1),
    COMPLETED(2),
    PROCESSING_ERROR(10)
}

@Entity
@Table(name = "user_record_feedback")
data class RecordFeedback(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null,

    @Column(nullable = false)
    var status: RecordFeedbackStatus = RecordFeedbackStatus.QUEUED,

    @Column(nullable = true, columnDefinition = "TEXT")
    var aiFeedback: String? = null,

    @Column(nullable = true, columnDefinition = "TEXT")
    var data: String? = null,

    @Column(nullable = true, columnDefinition = "TEXT")
    var comment : String? = null,

    @ManyToOne
    val record: Record? = null,

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
