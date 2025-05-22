package kr.ac.kookmin.wuung.model

import io.swagger.v3.oas.annotations.Hidden
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import space.mori.dalbodeule.snapadmin.external.annotations.DisplayName
import space.mori.dalbodeule.snapadmin.external.annotations.HiddenColumn
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit


@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null,

    @Column(nullable = false, length = 32, name = "username")
    var userName: String,

    @Column(nullable = false, length = 255)
    var email: String,

    @Column(nullable = false, length = 255, name = "password")
    private var password: String,

    @Column(nullable = false)
    var roles: String,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var gender: GenderEnum,

    @Column(nullable = false)
    var birthDate: LocalDateTime,

    @HiddenColumn
    @Column(nullable = true, length = 512)
    var profile: String? = null,

    @OneToMany(mappedBy = "user", orphanRemoval = true, cascade = [CascadeType.ALL])
    var questStages: MutableList<UserQuestStages> = mutableListOf(),

    @OneToOne(mappedBy = "user", cascade = [CascadeType.ALL])
    var pot : Pot? = null,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
): UserDetails {
   constructor(): this(
       "",
       "",
       "",
       "",
       "",
       GenderEnum.UNKNOWN,
       LocalDateTime.now()
    )
  
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return roles?.split(",")?.map { role -> SimpleGrantedAuthority(role.trim()) }?.toMutableList()
            ?: mutableListOf(SimpleGrantedAuthority("ROLE_USER"))
    }

    override fun getPassword(): String {
        return password
    }
    fun setPassword(password: String) {
        this.password = password
    }
    override fun isEnabled(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isAccountNonExpired(): Boolean = true
    override fun getUsername(): String = email

    val age: Long?
        get() = birthDate.let { ChronoUnit.YEARS.between(it, LocalDateTime.now()) }

    @PreUpdate
    private fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }

    @PrePersist
    private fun onCreate() {
        QuestType.entries.forEach { questType ->
            val questStage = UserQuestStages(
                user = this,
                stage = 1,
                type = questType,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
            questStages.add(questStage)
        }

        pot = Pot(
            user = this,
            exp = 0,
            level = 1,
            coupon = 0,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
    }

    @get:DisplayName
    val displayName: String?
        get() = this.userName
}

enum class GenderEnum(val value: String) {
    MALE("MALE"),
    FEMALE("FEMALE"),
    THIRD_GENDER("THIRD_GENDER"),
    UNKNOWN("UNKNOWN")
}
