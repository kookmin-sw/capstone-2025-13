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
@Table(name = "configurations")
class Configurations(
    @Id
    @GeneratedValue(GenerationType.IDENTITY)
    val id: Long? = null,

    @Enumerated(EnumType.STRING)
    val key: ConfigurationKey? = null,

    @Column(nullable = true, columnDefinition = "TEXT")
    val value: String? = null
)

enum class ConfigurationKey(val value: String) {
    RECORD_PROMPT("RECORD_PROMPT"),
    LUCKY_VICKY("LUCKY_VICKY")
}