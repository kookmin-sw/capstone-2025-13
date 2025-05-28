package kr.ac.kookmin.wuung.model

import jakarta.persistence.*
import space.mori.dalbodeule.snapadmin.external.annotations.HiddenEditForm
import java.time.LocalDateTime

@Entity
@Table(name = "user_test")
data class Test(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id : Long? = null,

    @Column(nullable = false)
    var type : Long,
    // 0 : Simple test
    // 1 : Normal test (PHQ-9)
    // 2 : Normal test (BDI) ...
    // 3 ...
    @Column(nullable = false)
    var result : Long,

    @HiddenEditForm
    @Column(nullable = false)
    var dateAt : LocalDateTime = LocalDateTime.now(),

    @OneToOne
    @JoinColumn(nullable = false)
    val user: User,
) {
    constructor(): this(
        type = 0,
        result = 0,
        user = User(),
    )
}