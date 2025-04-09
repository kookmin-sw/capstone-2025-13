package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import kr.ac.kookmin.wuung.jwt.JwtProvider
import kr.ac.kookmin.wuung.model.RefreshToken
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.repository.RefreshTokenRepository
import kr.ac.kookmin.wuung.repository.UserRepository
import kr.ac.kookmin.wuung.service.TokenService
import org.springframework.security.crypto.password.PasswordEncoder
import java.time.LocalDateTime

data class LoginRequest(val email: String, val password: String)
data class LoginResponse(val accessToken: String, val refreshToken: String)
data class TokenRefreshRequest(val refreshToken: String)
data class TokenRefreshResponse(val accessToken: String, val refreshToken: String)

data class LogoutRequest(val accessToken: String, val refreshToken: String)

data class UserInfoResponse(val email: String, val roles: List<String>, val username: String)

data class SignUpRequest(val userName: String, val email: String, val password: String, val sex: Boolean, val age: Long, val birthDate: LocalDateTime)

data class SignUpResponse(val accessToken: String, val refreshToken: String)

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth API", description = "Endpoints for authentication and token management")
class AuthController(
    @Autowired private val authenticationManager: AuthenticationManager,
    @Autowired private val userRepository: UserRepository,
    @Autowired private val refreshTokenRepository: RefreshTokenRepository,
    @Autowired private val jwtProvider: JwtProvider,
    @Autowired private val tokenService: TokenService,
    @Autowired private val passwordEncoder: PasswordEncoder
) {
   @PostMapping("/login")
   @Operation(summary = "Authenticate user and generate JWT tokens", description = "Validates user credentials and provides access and refresh tokens.")
   @ApiResponses(
       value = [
           ApiResponse(responseCode = "200", description = "Successfully authenticated", content = [Content(mediaType = "application/json", schema = Schema(implementation = LoginResponse::class))]),
           ApiResponse(responseCode = "401", description = "Invalid credentials", content = [Content(schema=Schema(implementation=java.lang.Exception::class))]),
           ApiResponse(responseCode = "400", description = "Bad Request", content = [Content(schema=Schema(implementation=java.lang.Exception::class))]),
       ]
   )
   fun authenticateUser(
       @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Email and password for authentication") 
       @RequestBody loginRequest: LoginRequest
   ): ResponseEntity<LoginResponse> {
       val authentication = authenticationManager.authenticate(
           UsernamePasswordAuthenticationToken(loginRequest.email, loginRequest.password)
       )

       val user = userRepository.findByEmail(loginRequest.email).get()

       val accessToken = jwtProvider.generateAccessToken(user)
       val refreshToken = jwtProvider.generateRefreshToken(user)

       refreshTokenRepository.save(RefreshToken(
           token = refreshToken,
           user = user,
           expiryDate = LocalDateTime.now().plusSeconds(tokenService.getRefreshTokenValidity())
       ))

       return ResponseEntity.ok(LoginResponse(accessToken, refreshToken))
   }


    @PostMapping("/refresh")
    @Operation(summary = "Refresh JWT tokens", description = "Generates new access and refresh tokens from a valid refresh token.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully refreshed tokens", content = [Content(mediaType = "application/json", schema = Schema(implementation = TokenRefreshResponse::class))]),
            ApiResponse(responseCode = "400", description = "Invalid or expired refresh token", content = [Content(schema=Schema(implementation=java.lang.Exception::class))])
        ]
    )
    fun refreshToken(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Refresh token to generate new tokens")
        @RequestBody tokenRefreshRequest: TokenRefreshRequest
    ): ResponseEntity<TokenRefreshResponse> {
        val requestRefreshToken = tokenRefreshRequest.refreshToken

        return tokenService.findByToken(requestRefreshToken).map { refreshToken ->
            try {
                tokenService.verifyExpiration(refreshToken)
                val user = refreshToken.user

                println(user)

                user?.let {
                    val accessToken = jwtProvider.generateAccessToken(it)

                    ResponseEntity.ok(TokenRefreshResponse(accessToken, requestRefreshToken))
                } ?: ResponseEntity.badRequest().body<TokenRefreshResponse>(null)
            } catch(e: Exception) {
                ResponseEntity.badRequest().body<TokenRefreshResponse>(null)
            }
        }.orElse(ResponseEntity.status(403).build())
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Invalidates refresh tokens for the user.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully logged out", content = [Content(schema=Schema(implementation=Object::class))]),
            ApiResponse(responseCode = "400", description = "Invalid refresh token", content = [Content(schema=Schema(implementation=java.lang.Exception::class))])
        ]
    )
    fun logoutUser(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Refresh token to invalidate")
        @RequestBody tokenRevokeRequest: LogoutRequest
    ): ResponseEntity<String> {
        val requestRefreshToken = tokenRevokeRequest.refreshToken
        tokenService.findByToken(requestRefreshToken).ifPresent {refreshToken ->
            refreshToken.user?.let { tokenService.deleteByUser(it) }
        }

        return ResponseEntity.ok("Success")
    }

    @PostMapping("/signup")
    @Operation(
        summary = "Sign up new user and generate new tokens",
        description = "Create new user provided credentials with additional fields and generate tokens for access"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "sign up user",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = SignUpResponse::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "sign up failed",
                content = [Content(schema = Schema(implementation = java.lang.Exception::class))]
            )
        ]
    )
    fun signUpUser(
        @RequestBody signUpRequest: SignUpRequest
    ): ResponseEntity<SignUpResponse>{

        // 이메일 중복 여부 검사
        if (userRepository.findByEmail(signUpRequest.email).isPresent) {
            return ResponseEntity.badRequest().build()  // 혹은 적절한 오류 메시지를 반환
        }

        // userName을 UK로 취급할 건가?
        // 할꺼면 중복 검사 루틴 추가

        // 새 사용자 생성
        val newUser = User(
            userName = signUpRequest.userName,
            email = signUpRequest.email,
            password = passwordEncoder.encode(signUpRequest.password), // 패스워드를 인코딩하는 요소를 뭔가 만들어야할 것 같은데 ... 로그인에서 이걸 고려하는지 모르겠네...? getPassword보니까 아무런 decode 로직도 없는 것 같은데 평문으로 관리하는건가?
            roles = "ROLE_USER",  // 이게 역할이 뭐가 있는지? 유져랑 마스터, 이런거? 아니면 미정?
            sex = signUpRequest.sex,
            age = signUpRequest.age,
            birthDate = signUpRequest.birthDate
        )

        // 데이터베이스에 사용자 저장
        userRepository.save(newUser)

        // 사용자가 회원가입과 동시에 로그인한 것처럼 JWT 토큰 생성 (필요에 따라 토큰 발급 여부 조정)
        val accessToken = jwtProvider.generateAccessToken(newUser)
        val refreshToken = jwtProvider.generateRefreshToken(newUser)

        refreshTokenRepository.save(RefreshToken(
            token = refreshToken,
            user = newUser,
            expiryDate = LocalDateTime.now().plusSeconds(tokenService.getRefreshTokenValidity())
        ))

        // 생성된 토큰을 포함한 응답 전송
        return ResponseEntity.ok(SignUpResponse(accessToken, refreshToken))
    }

    @GetMapping("/me")
    @Operation(
        summary = "Get current user's information",
        description = "Retrieves the logged-in user's information using a valid access token."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully retrieved user information",
                content = [Content(schema = Schema(implementation = UserInfoResponse::class), mediaType = "application/json")]
            ),
            ApiResponse(
                responseCode = "401",
                description = "Unauthorized - Invalid or missing access token",
                content = [Content(schema = Schema(implementation = java.lang.Exception::class))]
            )
        ]
    )
    fun getUserInfo(
        @AuthenticationPrincipal userDetails: User?,
    ): ResponseEntity<UserInfoResponse> {
        if(userDetails?.id == null) return ResponseEntity.badRequest().body(null)

        val user = userRepository.findById(userDetails.id ?: "").get()

        val userInfo = UserInfoResponse(
            user.email!!,
            user.authorities.map { it.authority },
            user.userName!!
        )
        return ResponseEntity.ok(userInfo)
    }
}