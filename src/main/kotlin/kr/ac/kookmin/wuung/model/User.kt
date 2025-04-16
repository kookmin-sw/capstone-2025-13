package kr.ac.kookmin.wuung.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit


@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null,

    @Column(nullable = false, length = 32, name = "username")
    var userName: String? = null,

    @Column(nullable = false, length = 255)
    var email: String? = null,

    @Column(nullable = false, length = 255, name = "password")
    private var password: String? = null,

    @Column(nullable = false)
    var roles: String? = null,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var gender: GenderEnum? = null,

    @Column(nullable = false)
    var birthDate : LocalDateTime? = null,

    @Column(nullable = true, length = 512)
    var profile: String? = null,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
): UserDetails {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return roles?.split(",")?.map { role -> SimpleGrantedAuthority(role) }?.toMutableList()
            ?: mutableListOf(SimpleGrantedAuthority("ROLE_USER"))
    }

    override fun getPassword(): String {
        return password ?: ""
    }
    fun setPassword(password: String) {
        this.password = password
    }
    override fun isEnabled(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isAccountNonExpired(): Boolean = true
    override fun getUsername(): String = email ?: ""

    val age: Long?
        get() = birthDate?.let { ChronoUnit.YEARS.between(it, LocalDateTime.now()) }

    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}

enum class GenderEnum(val value: String) {
    MALE("MALE"),
    FEMALE("FEMALE"),
    THIRD_GENDER("THIRD_GENDER"),
    UNKNOWN("UNKNOWN")
}

enum class GenderEnum(val value: String) {
    MALE("MALE"),
    FEMALE("FEMALE");
}
