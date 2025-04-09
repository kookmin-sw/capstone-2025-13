package kr.ac.kookmin.wuung.service

import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import kr.ac.kookmin.wuung.jwt.JwtProvider
import kr.ac.kookmin.wuung.model.RefreshToken
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.repository.RefreshTokenRepository
import java.time.LocalDateTime
import java.util.Optional

@Service
class TokenService(
    @Autowired private val jwtProvider: JwtProvider,
    @Autowired private val refreshTokenRepository: RefreshTokenRepository,
    @Value("\${jwt.refresh-token-validity}") private val refreshTokenValidity: Long
) {
    fun generateAccessToken(user: User): String {
        return jwtProvider.generateAccessToken(user)
    }

    fun generateRefreshToken(user: User): String {
        val refreshToken = jwtProvider.generateRefreshToken(user)
        val newRefreshToken = RefreshToken(
            token = refreshToken,
            user = user,
            expiryDate = LocalDateTime.now().plusSeconds(refreshTokenValidity)
        )

        refreshTokenRepository.findByUser(user).ifPresent {
            refreshTokenRepository.delete(it)
        }
        refreshTokenRepository.save(newRefreshToken)
        return refreshToken
    }

    @Transactional
    fun verifyExpiration(token: RefreshToken): RefreshToken {
        if(token.expiryDate.isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token)
            throw RuntimeException("Refresh token was expired.")
        }

        return token
    }

    fun findByToken(token: String): Optional<RefreshToken> {
        return refreshTokenRepository.findByToken(token)
    }

    fun deleteByUser(user: User) {
        refreshTokenRepository.deleteByUser(user)
    }

    fun getRefreshTokenValidity(): Long {
        return refreshTokenValidity
    }
}