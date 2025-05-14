package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import java.time.LocalDateTime

enum class LuckyVickyStatus(val value: Short) {
    QUEUED(0),
    PROCESSING(1),
    COMPLETED(2),
    NOFEEDBACK(3),
    PROCESSING_ERROR(10)
}

@Entity
@Table(name = "user_records")
data class Record(
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    var id : Long? = null,

    @Column(nullable = false)
    var rate : Int = 0,

    @Column(nullable = false, columnDefinition = "TEXT")
    var data : String? = null,

    @Column(nullable = true, columnDefinition = "TEXT")
    var luckyVicky: String? = null,

    @Column(nullable = true, columnDefinition = "TEXT")
    var comment : String? = null,

    @Enumerated
    var status : LuckyVickyStatus = LuckyVickyStatus.QUEUED,

    @ManyToOne
    @JoinColumn(name = "user_id")
    val user: User? = null,

    @Column(nullable = false)
    val createdAt : LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
) {
    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}