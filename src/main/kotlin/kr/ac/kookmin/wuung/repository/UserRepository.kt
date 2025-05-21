package kr.ac.kookmin.wuung.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import kr.ac.kookmin.wuung.model.User
import java.util.Optional

@Repository
interface UserRepository: JpaRepository<User, String> {
    fun findByEmail(email: String): Optional<User>
    fun findUserById(id: String): Optional<User>
}