package kr.ac.kookmin.wuung.controller

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import kr.ac.kookmin.wuung.exceptions.AlreadyExistException
import kr.ac.kookmin.wuung.exceptions.ServerErrorException
import kr.ac.kookmin.wuung.exceptions.UnauthorizedException
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
import kr.ac.kookmin.wuung.lib.ApiResponseDTO
import kr.ac.kookmin.wuung.lib.datetimeParser
import kr.ac.kookmin.wuung.model.GenderEnum
import kr.ac.kookmin.wuung.model.RefreshToken
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.repository.RefreshTokenRepository
import kr.ac.kookmin.wuung.repository.UserRepository
import kr.ac.kookmin.wuung.service.ProfileS3Service
import kr.ac.kookmin.wuung.service.TokenService
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDate
import java.time.LocalDateTime

data class LoginRequest(val email: String, val password: String)
data class LoginResponse(val accessToken: String, val refreshToken: String)
data class TokenRefreshRequest(val refreshToken: String)
data class TokenRefreshResponse(val accessToken: String, val refreshToken: String)

data class LogoutRequest(val accessToken: String, val refreshToken: String)

data class UserInfoDTO(
    val id: String,
    val email: String,
    val roles: List<String>,
    val username: String,
    val gender: GenderEnum = GenderEnum.UNKNOWN,
    val birthDate: LocalDate = LocalDate.now(),
    @JsonIgnore
    val profileSrc: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now(),
) {
    @JsonIgnore
    private var _profileEndpoint: String = ""
    @JsonIgnore
    private var _profileBucketName: String = ""

    @get:JsonIgnore
    var profileEndpoint: String
        get() = _profileEndpoint
        set(value) {
            _profileEndpoint = value
        }
    @get:JsonIgnore
    var profileBucketName: String
        get() = _profileEndpoint
        set(value) {
            _profileBucketName = value
        }

    @get:JsonProperty("profile")
    val profile: String?
        get() {
            return if (profileSrc?.isBlank() == true || _profileEndpoint.isBlank() || _profileBucketName.isBlank()) null
            else return "$_profileEndpoint/$_profileBucketName/$profileSrc"
        }
}

fun User.toDTO() = UserInfoDTO(
    id = id ?: "",
    email = email ?: "",
    roles = authorities.map { it.authority },
    username = userName ?: "",
    gender = gender ?: GenderEnum.UNKNOWN,
    birthDate = birthDate?.toLocalDate() ?: LocalDate.now(),
    profileSrc = profile ?: "",
    createdAt = createdAt,
    updatedAt = updatedAt,
)

data class SignUpRequest(
    @field:JsonProperty("user_name")
    val userName: String,
    val email: String,
    val password: String,
    val gender: GenderEnum,

    @field:Schema(description = "Birth date in format yyyy-MM-dd", example = "2000-01-01")
    @field:JsonProperty("birth_date")
    val birthDate: String
)

data class SignUpResponse(val accessToken: String, val refreshToken: String)

data class UpdateUserRequest(
    @field:JsonProperty("user_name")
    val userName: String? = null,
    val password: String? = null,
    val gender: GenderEnum? = null,

    @field:Schema(description = "Birth date in format yyyy-MM-dd", example = "2000-01-01")
    @field:JsonProperty("birth_date")
    val birthDate: String? = null,
)

data class UpdateUserResponse(
    val email: String,
    val userName: String,
    val gender: GenderEnum,
    val birthDate: LocalDateTime,
)

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth API", description = """
    [en]
    Endpoints for authentication and token management.
    Tokens are valid for 15 minutes.
    Refreshed tokens will be invalidated for the previous token.
    The refresh token can be used to obtain new access tokens until they expire.
    AccessToken is required for protected endpoints on Authorization header.
    
    [ko]
    인증 및 토큰 관리를 위한 엔드포인트입니다.
    토큰은 15분간 유효합니다.
    새로고침된 토큰은 이전 토큰을 무효화합니다.
    리프레시 토큰은 만료될 때까지 새로운 액세스 토큰을 얻는 데 사용할 수 있습니다.
    보호된 엔드포인트에는 Authorization 헤더에 AccessToken이 필요합니다.
""")
class AuthController(
    @Autowired private val authenticationManager: AuthenticationManager,
    @Autowired private val userRepository: UserRepository,
    @Autowired private val refreshTokenRepository: RefreshTokenRepository,
    @Autowired private val jwtProvider: JwtProvider,
    @Autowired private val tokenService: TokenService,
    @Autowired private val passwordEncoder: PasswordEncoder,
    @Autowired private val profileS3Service: ProfileS3Service,
    @Value("\${s3.public-endpoint}") private val s3PublicEndpoint: String,
    @Value("\${s3.profile-bucket}") private val s3BucketName: String,
) {
   @PostMapping("/login")
   @Operation(
       summary = "Authenticate user and generate JWT tokens / 사용자 인증 및 JWT 토큰 생성", description =
           """
        [en]
        Validates user credentials and provides access and refresh tokens.
        Tokens are valid for 15 minutes.
        Refreshed tokens will be invalidated for the previous token.
        The refresh token can be used to obtain new access tokens until they expire.
        This endpoint is not protected and can be used by unauthenticated clients.
   
        [ko]
        사용자 자격 증명을 검증하고 액세스 및 리프레시 토큰을 제공합니다.
        토큰은 15분간 유효합니다.
        새로고침된 토큰은 이전 토큰을 무효화합니다.
        리프레시 토큰은 만료될 때까지 새로운 액세스 토큰을 얻는 데 사용할 수 있습니다.
        이 엔드포인트는 보호되지 않으며 인증되지 않은 클라이언트가 사용할 수 있습니다.
    """
   )
   @ApiResponses(
       value = [
           ApiResponse(responseCode = "200", description = "Successfully authenticated", useReturnTypeSchema = true),
           ApiResponse(responseCode = "401", description = "Invalid credentials", content = [Content(schema=Schema(implementation=ApiResponseDTO::class))]),
           ApiResponse(responseCode = "400", description = "Bad Request", content = [Content(schema=Schema(implementation=ApiResponseDTO::class))]),
       ]
   )
   fun authenticateUser(
       @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Email and password for authentication") 
       @RequestBody loginRequest: LoginRequest
   ): ResponseEntity<ApiResponseDTO<LoginResponse>> {
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

       return ResponseEntity.ok(ApiResponseDTO(data = LoginResponse(accessToken, refreshToken)))
   }

    @PostMapping("/refresh")
    @Operation(
        summary = "Refresh JWT tokens / JWT 토큰 새로고침", description =
            """
        [en]
        Generates new access and refresh tokens from a valid refresh token.
        Tokens are valid for 15 minutes.
        The refresh token can be used to obtain new access tokens until they expire.
        This endpoint is not protected and can be used by unauthenticated clients.
    
        [ko]
        유효한 리프레시 토큰으로 새로운 액세스 및 리프레시 토큰을 생성합니다.
        토큰은 15분간 유효합니다.
        리프레시 토큰은 만료될 때까지 새로운 액세스 토큰을 얻는 데 사용할 수 있습니다.
        이 엔드포인트는 보호되지 않으며 인증되지 않은 클라이언트가 사용할 수 있습니다.
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully refreshed tokens", useReturnTypeSchema = true),
            ApiResponse(responseCode = "400", description = "Invalid or expired refresh token", content = [Content(schema=Schema(implementation=java.lang.Exception::class))])
        ]
    )
    fun refreshToken(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Refresh token to generate new tokens")
        @RequestBody tokenRefreshRequest: TokenRefreshRequest
    ): ResponseEntity<ApiResponseDTO<TokenRefreshResponse>> {
        val requestRefreshToken = tokenRefreshRequest.refreshToken

        return tokenService.findByToken(requestRefreshToken)
            .map { refreshToken ->
                try {
                    processRefreshToken(refreshToken, requestRefreshToken)
                } catch (e: UnauthorizedException) {
                    throw e
                } catch (e: Exception) {
                    throw ServerErrorException()
                }
            }
            .orElseThrow {
                ServerErrorException()
            }
    }

    private fun processRefreshToken(refreshToken: RefreshToken, requestRefreshToken: String): ResponseEntity<ApiResponseDTO<TokenRefreshResponse>> {
        // 토큰 만료 검증
        tokenService.verifyExpiration(refreshToken)

        // 사용자 확인
        val user = refreshToken.user ?: throw UnauthorizedException()

        // 새 액세스 토큰 생성
        val accessToken = jwtProvider.generateAccessToken(user)

        // 응답 생성
        return ResponseEntity.ok(
            ApiResponseDTO(data = TokenRefreshResponse(accessToken, requestRefreshToken))
        )
    }

    @PostMapping("/logout")
    @Operation(
        summary = "Logout user / 사용자 로그아웃", description = """
        [en]
        Invalidates refresh tokens for the user. The user will need to authenticate again to obtain new tokens.
        This endpoint is protected and requires a valid access token.
    
        [ko]
        사용자의 리프레시 토큰을 무효화합니다. 사용자는 새로운 토큰을 얻기 위해 다시 인증해야 합니다.
        이 엔드포인트는 보호되어 있으며 유효한 액세스 토큰이 필요합니다.
    """)
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully logged out", useReturnTypeSchema = true),
            ApiResponse(responseCode = "400", description = "Invalid refresh token", content = [Content(schema=Schema(implementation=java.lang.Exception::class))])
        ]
    )
    fun logoutUser(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Refresh token to invalidate")
        @RequestBody tokenRevokeRequest: LogoutRequest
    ): ResponseEntity<ApiResponseDTO<String>> {
        val requestRefreshToken = tokenRevokeRequest.refreshToken

        tokenService.findByToken(requestRefreshToken).ifPresent {refreshToken ->
            refreshToken.user?.let { tokenService.deleteByUser(it) }
        }

        return ResponseEntity.ok(ApiResponseDTO(data = "Success"))
    }

    @PostMapping("/signup")
    @Operation(
        summary = "Sign up new user and generate new tokens / 새 사용자 가입 및 토큰 생성",
        description = """
            [en]
            Create new user provided credentials with additional fields and generate tokens for access.
            Tokens are valid for 15 minutes.
            The refresh token can be used to obtain new access tokens until they expire.
            This endpoint is not protected and can be used by unauthenticated clients.
    
            [ko]
            추가 필드와 함께 제공된 자격 증명으로 새 사용자를 생성하고 액세스용 토큰을 생성합니다.
            토큰은 15분간 유효합니다.
            리프레시 토큰은 만료될 때까지 새로운 액세스 토큰을 얻는 데 사용할 수 있습니다.
            이 엔드포인트는 보호되지 않으며 인증되지 않은 클라이언트가 사용할 수 있습니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "sign up user",
                useReturnTypeSchema = true,
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
    ): ResponseEntity<ApiResponseDTO<SignUpResponse>>{

        // 이메일 중복 여부 검사
        if (userRepository.findByEmail(signUpRequest.email).isPresent)
            throw AlreadyExistException()

        // userName을 UK로 취급할 건가?
        // 할꺼면 중복 검사 루틴 추가

        // 새 사용자 생성
        val newUser = User(
            userName = signUpRequest.userName,
            email = signUpRequest.email,
            password = passwordEncoder.encode(signUpRequest.password),
            roles = "ROLE_USER",
            gender = signUpRequest.gender, // 코드 수정
            birthDate = signUpRequest.birthDate.datetimeParser()
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
        return ResponseEntity.ok(ApiResponseDTO(data = SignUpResponse(accessToken, refreshToken)))
    }

    @GetMapping("/me")
    @Operation(
        summary = "Get current user's information / 현재 사용자 정보 조회",
        description = """
            [en]
            Retrieves the logged-in user's information using a valid access token.
            The user's information will be returned in the response body.
            The response will include the user's email, roles, and username, as well as their gender and birth date.
            This endpoint is protected and requires a valid access token.
    
            [ko]
            유효한 액세스 토큰을 사용하여 로그인한 사용자의 정보를 검색합니다.
            사용자 정보는 응답 본문에 반환됩니다.
            응답에는 사용자의 이메일, 역할, 사용자 이름과 함께 성별과 생년월일이 포함됩니다.
            이 엔드포인트는 보호되어 있으며 유효한 액세스 토큰이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully retrieved user information",
                useReturnTypeSchema = true,
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
    ): ResponseEntity<ApiResponseDTO<UserInfoDTO>> {
        if(userDetails?.id == null) throw UnauthorizedException()

        val user = userRepository.findById(userDetails.id ?: "").get()

        val userDTO = user.toDTO()
        userDTO.profileEndpoint = s3PublicEndpoint
        userDTO.profileBucketName = s3BucketName

        return ResponseEntity.ok(ApiResponseDTO(data = userDTO ))
    }

    @PostMapping("/update")
    @Operation(
        summary = "Update user information / 사용자 정보 업데이트",
        description = """
            [en]
            Updates user information. Null fields will be ignored.
            The response will include the updated user's email, username, gender, and birth date.
            The user's information will be updated in the database.
            This endpoint is protected and requires a valid access token.
    
            [ko]
            사용자 정보를 업데이트합니다. Null 필드는 무시됩니다.
            응답에는 업데이트된 사용자의 이메일, 사용자 이름, 성별 및 생년월일이 포함됩니다.
            사용자 정보가 데이터베이스에서 업데이트됩니다.
            이 엔드포인트는 보호되어 있으며 유효한 액세스 토큰이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully updated user information",
                useReturnTypeSchema = true,
            ),
            ApiResponse(
                responseCode = "401",
                description = "Unauthorized - Invalid or missing access token",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            )
        ]
    )
    fun updateUser(
        @AuthenticationPrincipal userDetails: User?,
        @RequestBody updateRequest: UpdateUserRequest,
    ): ResponseEntity<ApiResponseDTO<UpdateUserResponse>> {
        if (userDetails?.id == null) throw UnauthorizedException()

        val user = userRepository.findById(userDetails.id!!).get()

        updateRequest.userName?.let { user.userName = it }
        updateRequest.password?.let { user.password = passwordEncoder.encode(it) }
        updateRequest.gender?.let { user.gender = it }
        updateRequest.birthDate?.let { user.birthDate = it.datetimeParser() }

        val updatedUser = userRepository.save(user)

        return ResponseEntity.ok(
            ApiResponseDTO(
                data = UpdateUserResponse(
                    email = updatedUser.email!!,
                    userName = updatedUser.userName!!,
                    gender = updatedUser.gender!!,
                    birthDate = updatedUser.birthDate!!
                )
            )
        )
    }

    @PutMapping("/profile",
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE],
        produces = [MediaType.APPLICATION_JSON_VALUE]
    )
    @Operation(
        summary = "Update user profile image / 사용자 프로필 이미지 업데이트",
        description = """
            [en]
            Updates the user's profile image. The image will be uploaded to S3 storage.
            The response will include the updated user's information including the new profile image URL.
            Maximum file size is 5MB and only image files (jpg, jpeg, png) are allowed.
            This endpoint is protected and requires a valid access token.
    
            [ko]
            사용자의 프로필 이미지를 업데이트합니다. 이미지는 S3 저장소에 업로드됩니다.
            응답에는 새 프로필 이미지 URL을 포함한 업데이트된 사용자 정보가 포함됩니다.
            최대 파일 크기는 5MB이며 이미지 파일(jpg, jpeg, png)만 허용됩니다.
            이 엔드포인트는 보호되어 있으며 유효한 액세스 토큰이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully updated profile image",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "401",
                description = "Unauthorized - Invalid or missing access token",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Invalid file format or size",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            )
        ]
    )
    fun updateProfile(
        @AuthenticationPrincipal userDetails: User?,
        @Parameter(
            name = "file",
            description = "Profile image file to be uploaded",
            required = true,
            schema = Schema(type = "string", format = "binary")
        )
        return ResponseEntity.ok(userInfo)
        @RequestPart("multipartFile", required = true)
        multipartFile: MultipartFile,
    ): ResponseEntity<ApiResponseDTO<UserInfoDTO>> {
        if(userDetails?.id == null) throw UnauthorizedException()

        val file = profileS3Service.uploadProfile(userDetails, multipartFile)

        val user = userRepository.findById(userDetails.id!!).get()
        user.profile = file

        val updatedUser = userRepository.save(user)

        val userDTO = updatedUser.toDTO()
        userDTO.profileEndpoint = s3PublicEndpoint
        userDTO.profileBucketName = s3BucketName

        return ResponseEntity.ok(ApiResponseDTO(data = userDTO))
    }

    @DeleteMapping("/profile")
    @Operation(
        summary = "Delete user profile image / 사용자 프로필 이미지 삭제",
        description = """
            [en]
            Deletes the user's profile image from S3 storage(or compatible storage)
            and removes the profile image reference.
            The response will include the updated user's information with no profile image.
            This endpoint is protected and requires a valid access token.
    
            [ko]
            S3 저장소(또는 호환 가능한 저장소)에서 사용자의 프로필 이미지를 삭제하고
            프로필 이미지 참조를 제거합니다.
            응답에는 프로필 이미지가 없는 업데이트된 사용자 정보가 포함됩니다.
            이 엔드포인트는 보호되어 있으며 유효한 액세스 토큰이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully deleted profile image",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "401",
                description = "Unauthorized - Invalid or missing access token",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            )
        ]
    )
    fun deleteProfile(
        @AuthenticationPrincipal userDetails: User?,
    ): ResponseEntity<ApiResponseDTO<UserInfoDTO>> {
        if (userDetails?.id == null) throw UnauthorizedException()

        profileS3Service.removeProfile(userDetails)

        val user = userRepository.findById(userDetails.id!!).get()
        user.profile = null

        val updatedUser = userRepository.save(user)

        val userDTO = updatedUser.toDTO()
        userDTO.profileEndpoint = s3PublicEndpoint
        userDTO.profileBucketName = s3BucketName

        return ResponseEntity.ok(ApiResponseDTO(data = userDTO))
    }
}
