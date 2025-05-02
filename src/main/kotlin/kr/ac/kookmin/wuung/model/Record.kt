package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import java.time.LocalDateTime

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

    @ManyToOne
    val user: User? = null,

    @OneToMany
    val recordFeedback: List<RecordFeedback> = listOf(),

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