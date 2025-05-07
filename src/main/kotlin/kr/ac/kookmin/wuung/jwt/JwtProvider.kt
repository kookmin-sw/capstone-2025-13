package kr.ac.kookmin.wuung.jwt

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import kr.ac.kookmin.wuung.exceptions.InvalidIssuerException
import kr.ac.kookmin.wuung.exceptions.JwtExpiredException
import kr.ac.kookmin.wuung.exceptions.UnauthorizedException
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
    @Value("\${jwt.issuer}") private val issuer: String,
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
            .issuer(issuer)
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
            .issuer(issuer)
            .build()

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(Date.from(Instant.now()))
            .setExpiration(Date.from(Instant.now().plusSeconds(refreshTokenValidity)))
            .signWith(SignatureAlgorithm.RS512, signingKey)
            .compact()
    }

    fun getUsernameFromJwt(token: String): String {
        val jwt = parseJwts(token)

        if (jwt?.issuer != issuer) throw InvalidIssuerException()
        return jwt.subject ?: throw UnauthorizedException()
    }

    fun getUserIdFromJwt(token: String): String {
        val jwt = parseJwts(token)

        if(jwt?.issuer != issuer) throw InvalidIssuerException()
        return jwt.id ?: throw UnauthorizedException()
    }

    fun parseJwts(token: String): Claims? {
        val jwt = parser
            .parseClaimsJws(token)
            .body

        if(!jwt.expiration.before(Date.from(Instant.now())))
            throw JwtExpiredException()
        if(jwt?.issuer != issuer) throw InvalidIssuerException()

        return jwt
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