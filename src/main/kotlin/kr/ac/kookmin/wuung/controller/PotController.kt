package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import kr.ac.kookmin.wuung.exceptions.NotFoundException
import kr.ac.kookmin.wuung.exceptions.UnauthorizedException
import kr.ac.kookmin.wuung.exceptions.CouponNotEnoughException
import kr.ac.kookmin.wuung.exceptions.PotMaxLevelReachedException
import kr.ac.kookmin.wuung.lib.ApiResponseDTO
import kr.ac.kookmin.wuung.model.Pot
import kr.ac.kookmin.wuung.model.PotLevel
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.repository.PotLevelRepository
import kr.ac.kookmin.wuung.repository.PotRepository
import kr.ac.kookmin.wuung.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import kotlin.jvm.optionals.getOrNull

data class PotStatusDTO(
    val level: Int,
    val exp: Int,
    val need: Int,
    val coupon: Int
)

@RestController
@RequestMapping("/pot")
@Tag(
    name = "Pot API",
    description = """
    [en]
    API endpoints for managing plant pot status and coupon operations.
    These endpoints allow users to check their pot's status, get new coupons, and use coupons for experience points.
    All endpoints require user authentication.
    
    [ko]
    화분 상태 및 쿠폰 작업을 관리하기 위한 API 엔드포인트입니다.
    사용자가 화분 상태를 확인하고, 새로운 쿠폰을 받고, 경험치를 위해 쿠폰을 사용할 수 있습니다.
    모든 엔드포인트는 사용자 인증이 필요합니다.
"""
)
class PotController(
    @Autowired private val potRepository: PotRepository,
    @Autowired private val potLevelRepository: PotLevelRepository,
    @Autowired private val userRepository: UserRepository
) {

    @GetMapping("/status")
    @Operation(
        summary = "[en] get pot status [ko] 화분 상태 조회",
        description = """
            [en]
            Retrieves the current status of user's plant pot including level, experience points, and coupon count.
            This endpoint is protected and requires authentication.
        
            [ko]
            사용자 화분의 현재 상태(레벨, 경험치, 쿠폰 개수 등)를 조회합니다.
            이 엔드포인트는 보호되어 있으며 사용을 위해서 accessToken이 필요합니다.
        """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "get pot status successfully",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "403",
                description = "Unauthorized access",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "pot not found",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            ),
            ApiResponse(
                responseCode = "445",
                description = "Max Level Reached",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            )
        ]
    )
    fun getPotStatus(
        @AuthenticationPrincipal userDetails: User?
    ): ResponseEntity<ApiResponseDTO<PotStatusDTO>> {
        if (userDetails == null) throw UnauthorizedException()
        val user = userRepository.findUserById(userDetails.id ?: "").getOrNull() ?: throw NotFoundException()

        // 사용자가 가진 pot 정보 조회 및 pot Level 정보에 대한 요구치 조회
        var pot = potRepository.findPotByUser(user).getOrNull()

        if (pot == null) {
            pot = Pot(
                user = user,
            )
            potRepository.save(pot)
        }

        val potLevel = try {
            potLevelRepository.findPotLevelByLevel(pot.level).orElseThrow { NotFoundException() }
        } catch (e: NotFoundException) {
            throw PotMaxLevelReachedException()
        }

        // 결과 반환
        return ResponseEntity.ok(
            ApiResponseDTO(
                data = PotStatusDTO(
                    level = pot.level,
                    exp = pot.exp,
                    need = potLevel.need,
                    coupon = pot.coupon
                )
            )
        )
    }

    @PostMapping("/getcoupon")
    @Operation(
        summary = "[en] increase coupon [ko] 새로운 쿠폰 획득",
        description = """
        [en]
        Adds one coupon to user's pot and returns the updated pot status.
        This endpoint is protected and requires authentication.
        
        [ko]
        사용자의 화분에 쿠폰 하나를 추가하고 업데이트된 화분 상태를 반환합니다.
        이 엔드포인트는 보호되어 있으며 사용을 위해서 accessToken이 필요합니다.
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "get coupon successfully",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "403",
                description = "Unauthorized access",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "pot not found",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            ),
            ApiResponse(
                responseCode = "445",
                description = "Max Level Reached",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            )
        ]
    )
    fun getCoupon(
        @AuthenticationPrincipal userDetails: User?
    ): ResponseEntity<ApiResponseDTO<PotStatusDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        val pot = potRepository.findPotByUser(userDetails).orElseThrow { NotFoundException() }
        pot.coupon += 1
        potRepository.save(pot)

        val potLevel = try {
            potLevelRepository.findPotLevelByLevel(pot.level).orElseThrow { NotFoundException() }
        } catch (e: NotFoundException) {
            throw PotMaxLevelReachedException()
        }

        return ResponseEntity.ok(
            ApiResponseDTO(
                data = PotStatusDTO(
                    level = pot.level,
                    exp = pot.exp,
                    need = potLevel.need,
                    coupon = pot.coupon
                )
            )
        )
    }

    @PostMapping("/usecoupon")
    @Operation(
        summary = "[en] use a coupon [ko] 하나의 쿠폰 사용",
        description = """
        [en]
        Uses one coupon to gain experience points. If experience points reach the required amount,
        the pot will level up and experience points will be reset to 0.
        This endpoint is protected and requires authentication.
        
        [ko]
        쿠폰 하나를 사용하여 경험치를 획득합니다. 경험치가 필요량에 도달하면
        화분의 레벨이 올라가고 경험치가 0으로 초기화됩니다.
        개발자가 정의한 레벨을 초과한 레벨업 시도시 상태값 445를 반환합니다.
        이 엔드포인트는 보호되어 있으며 사용을 위해서 accessToken이 필요합니다.
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "use coupon successfully",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "403",
                description = "Unauthorized access",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "pot not found",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            ),
            ApiResponse(
                responseCode = "444",
                description = "Not enough coupon",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            ),
            ApiResponse(
                responseCode = "445",
                description = "Max level reached",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            ),
        ]
    )
    fun useCoupon(
        @AuthenticationPrincipal userDetails: User?
    ): ResponseEntity<ApiResponseDTO<PotStatusDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        // 인증 체크
        val pot = potRepository.findPotByUser(userDetails).orElseThrow { NotFoundException() }

        // 쿠폰 개수 체크
        if (pot.coupon <= 0) throw CouponNotEnoughException()

        // 데이터 적용
        pot.coupon -= 1
        pot.exp += 1

        // 현재 레벨 조회 및 최대 레벨 체크
        val currentPotLevel = try {
            potLevelRepository.findPotLevelByLevel(pot.level).orElseThrow { NotFoundException() }
        } catch (e: NotFoundException) {
            throw PotMaxLevelReachedException()
        }

        // 레벨업 조건 확인 
        if (pot.exp >= currentPotLevel.need) {
            try {
                // 미리 다음 레벨이 존재하는지 확인
                potLevelRepository.findPotLevelByLevel(pot.level + 1).orElseThrow { PotMaxLevelReachedException() }
                pot.level += 1
                pot.exp = 0
            } catch (e: PotMaxLevelReachedException) {
                // 최대 레벨에 도달한 경우 exp를 need로 고정
                pot.exp = currentPotLevel.need
                throw e
            }
        }

        // 저장
        potRepository.save(pot)

        // 새로운 레벨 정보 조회
        val newPotLevel = try {
            potLevelRepository.findPotLevelByLevel(pot.level).orElseThrow { NotFoundException() }
        } catch (e: NotFoundException) {
            throw PotMaxLevelReachedException()
        }

        // 새 레벨 정보를 포함한 pot 정보 반환
        return ResponseEntity.ok(
            ApiResponseDTO(
                data = PotStatusDTO(
                    level = pot.level,
                    exp = pot.exp,
                    need = newPotLevel.need,
                    coupon = pot.coupon
                )
            )
        )
    }

    @PostMapping("/usecoupon/{number}")
    @Operation(
        summary = "[en] use multiple coupons [ko] 여러 개의 쿠폰 사용",
        description = """
        [en]
        Uses multiple coupons to gain experience points. If experience points reach the required amount,
        the pot will level up and experience points will be reset to 0. This can happen multiple times.
        This endpoint is protected and requires authentication.
        
        [ko]
        여러 개의 쿠폰을 한 번에 사용하여 경험치를 획득합니다. 경험치가 필요량에 도달하면
        화분의 레벨이 올라가고 경험치가 0으로 초기화됩니다. 이는 여러 번 발생할 수 있습니다.
        개발자가 정의한 레벨을 초과한 레벨업 시도시 상태값 445를 반환합니다.
        이 엔드포인트는 보호되어 있으며 사용을 위해서 accessToken이 필요합니다.
    """
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "use coupons successfully",
                useReturnTypeSchema = true
            ),
            ApiResponse(
                responseCode = "403",
                description = "Unauthorized access",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "pot not found",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            ),
            ApiResponse(
                responseCode = "444",
                description = "Not enough coupons",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            ),
            ApiResponse(
                responseCode = "445",
                description = "Max level reached",
                content = [Content(schema = Schema(implementation = ApiResponseDTO::class))]
            ),
        ]
    )
    fun useCouponMultiple(
        @AuthenticationPrincipal userDetails: User?,
        @PathVariable number: Int
    ): ResponseEntity<ApiResponseDTO<PotStatusDTO>> {
        if (userDetails == null) throw UnauthorizedException()

        // 인증 체크
        val pot = potRepository.findPotByUser(userDetails).orElseThrow { NotFoundException() }

        // 쿠폰 개수 체크
        if (pot.coupon < number) throw CouponNotEnoughException()

        // 쿠폰 사용 및 경험치 증가
        pot.coupon -= number
        pot.exp += number

        // 레벨업 처리
        var currentPotLevel = try {
            potLevelRepository.findPotLevelByLevel(pot.level).orElseThrow { NotFoundException() }
        } catch (e: NotFoundException) {
            throw PotMaxLevelReachedException()
        }

        // 레벨업이 여러 번 발생할 수 있으므로 while 루프 사용
        while (pot.exp >= currentPotLevel.need) {
            try {
                // 미리 다음 레벨이 존재하는지 확인
                potLevelRepository.findPotLevelByLevel(pot.level + 1).orElseThrow { PotMaxLevelReachedException() }
                pot.level += 1
                pot.exp -= currentPotLevel.need
                currentPotLevel =
                    potLevelRepository.findPotLevelByLevel(pot.level).orElseThrow { PotMaxLevelReachedException() }
            } catch (e: PotMaxLevelReachedException) {
                // 최대 레벨에 도달한 경우 exp를 need로 고정
                pot.exp = currentPotLevel.need
                throw e
            }
        }

        // 저장
        potRepository.save(pot)

        // 현재 레벨 정보 조회
        val newPotLevel = try {
            potLevelRepository.findPotLevelByLevel(pot.level).orElseThrow { NotFoundException() }
        } catch (e: NotFoundException) {
            throw PotMaxLevelReachedException()
        }

        // 새 레벨 정보를 포함한 pot 정보 반환
        return ResponseEntity.ok(
            ApiResponseDTO(
                data = PotStatusDTO(
                    level = pot.level,
                    exp = pot.exp,
                    need = newPotLevel.need,
                    coupon = pot.coupon
                )
            )
        )
    }
}