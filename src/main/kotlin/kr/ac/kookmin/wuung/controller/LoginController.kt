package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.Hidden
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Hidden
@Controller
class LoginController {
    @GetMapping("/login")
    fun loginPage(): String {
        return "login"
    }
}