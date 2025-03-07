package kr.ac.kookmin.wuung.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import kr.ac.kookmin.wuung.repository.UserRepository

@Service
class UserService(
    @Autowired private val userRepository: UserRepository,
): UserDetailsService {
    override fun loadUserByUsername(email: String): UserDetails {
        return userRepository.findByEmail(email)
            .orElseThrow { UsernameNotFoundException("User $email not found") }
    }

    fun loadUserById(userId: String): UserDetails {
        return userRepository.findById(userId)
            .orElseThrow { UsernameNotFoundException("UserId $userId not found") }
    }
}