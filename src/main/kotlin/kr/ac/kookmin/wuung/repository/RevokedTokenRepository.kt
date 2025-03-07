package kr.ac.kookmin.wuung.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import kr.ac.kookmin.wuung.model.RevokedToken
import java.util.Optional

@Repository
interface RevokedTokenRepository : JpaRepository<RevokedToken, Long> {
    fun findByToken(token: String): Optional<RevokedToken> // 토큰으로 조회
}