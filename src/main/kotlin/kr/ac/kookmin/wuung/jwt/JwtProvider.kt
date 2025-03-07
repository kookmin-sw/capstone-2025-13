package kr.ac.kookmin.wuung.jwt

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import kr.ac.kookmin.wuung.model.User
import java.security.PrivateKey
import java.security.PublicKey
import java.time.Instant
import java.util.Date

@Component
class JwtProvider(
    private val signingKey: PrivateKey,
    private val validateKey: PublicKey,
    @Value("\${jwt.access-token-validity}") private val accessTokenValidity: Long,
    @Value("\${jwt.refresh-token-validity}") private val refreshTokenValidity: Long,
) {

    private val parser = Jwts.parser()
        .setSigningKey(validateKey)
        .build()

    fun generateAccessToken(user: User): String {
        val claims = Jwts.claims()
            .add("Subject", user.username)
            .add("email", user.email)
            .add("userId", user.id)
            .add("roles", user.roles)
            .add("type", "access_token")
            .build()

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(Date.from(Instant.now()))
            .setExpiration(Date.from(Instant.now().plusSeconds(accessTokenValidity)))
            .signWith(SignatureAlgorithm.RS512, signingKey)
            .compact()
    }

    fun generateRefreshToken(user: User): String {
        val claims = Jwts.claims()
            .add("Subject", user.username)
            .add("email", user.email)
            .add("userId", user.id)
            .add("roles", user.roles)
            .add("type", "refresh_token")
            .build()

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(Date.from(Instant.now()))
            .setExpiration(Date.from(Instant.now().plusSeconds(refreshTokenValidity)))
            .signWith(SignatureAlgorithm.RS512, signingKey)
            .compact()
    }

    fun getUsernameFromJwt(token: String): String {
        return parseJwts(token)?.subject ?: throw RuntimeException("Invalid token")
    }

    fun getUserIdFromJwt(token: String): String {
        return parseJwts(token)?.id ?: throw RuntimeException("Invalid token")
    }

    fun parseJwts(token: String): Claims? {
        return parser
            .parseClaimsJws(token)
            .body
    }

    fun validateToken(authToken: String): Boolean {
        return try {
            parser.parseClaimsJws(authToken)

            true
        } catch(ex: Exception) {
            false
        }
    }
}