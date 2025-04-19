package kr.ac.kookmin.wuung.config.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/")
class MainController {
    @GetMapping("/")
    fun index(): ResponseEntity<String> {
        return ResponseEntity.ok("Hello World!")
    }
}