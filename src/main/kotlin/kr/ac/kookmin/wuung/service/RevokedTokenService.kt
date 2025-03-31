package kr.ac.kookmin.wuung.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import kr.ac.kookmin.wuung.model.RevokedToken
import kr.ac.kookmin.wuung.repository.RevokedTokenRepository

@Service
class RevokedTokenService(
    @Autowired
    private val revokedTokenRepository: RevokedTokenRepository
) {
    // 토큰이 Revoke되었는지 확인
    fun isTokenRevoked(token: String): Boolean {
        return revokedTokenRepository.findByToken(token).isPresent
    }

    // 토큰을 Revoke 처리
    fun revokeToken(token: String) {
        if (!isTokenRevoked(token)) {
            val revokedToken = RevokedToken(token = token)
            revokedTokenRepository.save(revokedToken)
        }
    }
}