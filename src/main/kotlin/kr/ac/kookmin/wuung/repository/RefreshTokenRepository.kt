package kr.ac.kookmin.wuung.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import kr.ac.kookmin.wuung.model.RefreshToken
import kr.ac.kookmin.wuung.model.User
import org.springframework.data.jpa.repository.Modifying
import java.util.Optional

@Repository
interface RefreshTokenRepository: JpaRepository<RefreshToken, String> {
    fun findByToken(token: String): Optional<RefreshToken>
    fun findByUser(user: User): Optional<RefreshToken>

    @Modifying
    fun deleteByUser(user: User)
}