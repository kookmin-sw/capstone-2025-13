package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Hidden
import kr.ac.kookmin.wuung.lib.ApiResponseDTO
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/")
class MainController {
    @GetMapping("/")
    @Hidden
    fun index(): ResponseEntity<ApiResponseDTO<String>> {
        return ResponseEntity.ok(ApiResponseDTO(data = "Hello World!"))
    }
}