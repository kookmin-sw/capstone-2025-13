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
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.annotation.Order
import org.springframework.security.config.Customizer
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.SecurityFilterChain
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
    @Order(1)
    fun jwtSecurityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .securityMatcher("/api/**", "/admin/**") // JWT 인증을 적용할 경로 지정
            .csrf { it.disable() }
            .cors {
                val configuration = CorsConfiguration().apply {
                    allowedOrigins = listOf("http://localhost:3000", "http://localhost:8080") + host.split(",").mapNotNull { it.trim() }
                    allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    allowedHeaders = listOf("Authorization", "Content-Type", "X-CSRF-TOKEN")
                    allowCredentials = true
                }
                val source = UrlBasedCorsConfigurationSource().apply {
                    registerCorsConfiguration("/**", configuration)
                }
                it.configurationSource(source)
            }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/auth/**", "/api/integrity/**", "/swagger-ui.html", "/swagger-ui/**", "/api-docs/**", "/v3/api-docs/**", "/v2/api-docs/**", "/swagger-resources/**", "/webjars/**").permitAll()
                    .anyRequest().authenticated()
            }
            .addFilterBefore(exceptionHandlerFilter, LogoutFilter::class.java)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)
            .authenticationProvider(authenticationProvider())
            .userDetailsService(userService)

        return http.build()
    }

    @Bean
    @Order(2)
    fun basicAuthSecurityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .securityMatcher("/login", "/logout", "/admin/**") // HTTP Basic 인증을 적용할 경로 지정
            .csrf { it.disable() }
            .cors {
                val configuration = CorsConfiguration().apply {
                    allowedOrigins = listOf("http://localhost:3000", "http://localhost:8080") + host.split(",").mapNotNull { it.trim() }
                    allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    allowedHeaders = listOf("Authorization", "Content-Type", "X-CSRF-TOKEN")
                    allowCredentials = true
                }
                val source = UrlBasedCorsConfigurationSource().apply {
                    registerCorsConfiguration("/**", configuration)
                }
                it.configurationSource(source)
            }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/admin/**").hasRole("ADMIN") // ADMIN 역할을 가진 사용자만 접근 가능
                    .requestMatchers("/login", "/logout").permitAll() // 로그인 및 로그아웃은 모두 접근 가능
                    .anyRequest().authenticated()
            }
            .formLogin {
                it.loginPage("/login")
                    .defaultSuccessUrl("/admin").permitAll()
            }
            .logout {
                it.logoutUrl("/logout")
                    .logoutSuccessUrl("/login")
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID")
                    .permitAll()
            }
            .httpBasic(Customizer.withDefaults()) // HTTP Basic 인증 활성화
            .authenticationProvider(authenticationProvider())
            .userDetailsService(userService)

        return http.build()
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