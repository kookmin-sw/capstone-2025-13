package kr.ac.kookmin.wuung.security

import io.jsonwebtoken.JwtException
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import kr.ac.kookmin.wuung.jwt.JwtProvider
import kr.ac.kookmin.wuung.service.RevokedTokenService
import kr.ac.kookmin.wuung.service.UserService

@Component
class JwtAuthenticationFilter(
    @Autowired private val jwtProvider: JwtProvider,
    @Autowired private val userService: UserService,
    @Autowired private val revokedTokenService: RevokedTokenService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            getJwtFromRequest(request)?.let { token ->
                val claims = jwtProvider.parseJwts(token) ?: return
                if (revokedTokenService.isTokenRevoked(token)) {
                    logger.warn("Token has been revoked. Token hash: ${token.hashCode()}")
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token has been revoked")
                    return
                }

                val userId = claims["userId"] as String
                val userDetails = userService.loadUserById(userId)
                val authentication =
                    UsernamePasswordAuthenticationToken(userDetails, null, userDetails.authorities).apply {
                        details = WebAuthenticationDetailsSource().buildDetails(request)
                    }
                SecurityContextHolder.getContext().authentication = authentication
            }
        } catch (e: UsernameNotFoundException) {
            logger.error("User not found: ${e.message}")
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found")
            return
        } catch (e: JwtException) {
            logger.error("Invalid JWT: ${e.message}")
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT")
            return
        } catch (e: Exception) {
            logger.error("Unexpected error during authentication", e)
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred")
            return
        }
        filterChain.doFilter(request, response)
    }

    private fun getJwtFromRequest(request: HttpServletRequest): String? {
        val bearerToken = request.getHeader("Authorization")
        return if (bearerToken?.startsWith("Bearer ") == true) {
            bearerToken.substring(7)
        } else null
    }
}