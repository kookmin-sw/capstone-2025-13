package kr.ac.kookmin.wuung.config

import kr.ac.kookmin.wuung.security.ExceptionHandlerFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.DefaultSecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import kr.ac.kookmin.wuung.security.JwtAuthenticationFilter
import kr.ac.kookmin.wuung.service.UserService
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.web.authentication.logout.LogoutFilter

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig(
    private val userService: UserService,
    private val jwtAuthenticationFilter: JwtAuthenticationFilter,
    private val exceptionHandlerFilter: ExceptionHandlerFilter,
    @Value("\${etc.host}")
    private val host: String
) {
    @Bean
    fun securityFilterChain(http: HttpSecurity): DefaultSecurityFilterChain {
        return http
            .csrf {
                it.disable()
            }
            .cors {
                val configuration = CorsConfiguration()

                val origins = mutableListOf("http://localhost:3000", "http://localhost:8080")
                origins.addAll(host.split(",").mapNotNull { it.trim() })

                configuration.allowedOrigins = origins
                configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
                configuration.allowedHeaders = listOf("Authorization", "Content-Type", "X-CSRF-TOKEN")
                configuration.allowCredentials = true

                val source = UrlBasedCorsConfigurationSource()
                source.registerCorsConfiguration("/**", configuration)

                it.configurationSource(source)
            }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authorizeHttpRequests {
                it.requestMatchers("/auth/**").permitAll()
                it.requestMatchers("/api/integrity").permitAll()
                it.requestMatchers("/").permitAll()
                it.requestMatchers(
                    "/swagger-ui.html",
                    "/swagger-ui/**",
                    "/api-docs/**",
                    "/v3/api-docs/**",
                    "/v2/api-docs/**",
                    "/swagger-resources/**",
                    "/webjars/**"
                ).permitAll()
                it.anyRequest().authenticated()
            }
            .addFilterBefore(exceptionHandlerFilter, LogoutFilter::class.java)
            // JWT 인증 필터는 예외 처리 필터 다음에 배치
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)
            .authenticationProvider(authenticationProvider())
            .build()
    }

    @Bean
    fun authenticationProvider(): AuthenticationProvider {
        val authProvider = DaoAuthenticationProvider()
        authProvider.setUserDetailsService(userService)
        authProvider.setPasswordEncoder(passwordEncoder())

        return authProvider
    }

    @Bean
    fun passwordEncoder() = BCryptPasswordEncoder()

    @Bean
    fun authenticationManager(authConfig: AuthenticationConfiguration): AuthenticationManager {
        return authConfig.authenticationManager
    }
}