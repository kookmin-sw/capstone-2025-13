package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "userRecord")
data class Record (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id : Long? = null,

    @Column(nullable = false)
    var original : String? = null,

    @Column(nullable = false)
    var tansformed : String? = null,

    @Column(nullable = false)
    var creationTime : LocalDateTime? = null,

    @OneToOne
    @JoinColumn(nullable = false)
    val user: User? = null,
) {

}