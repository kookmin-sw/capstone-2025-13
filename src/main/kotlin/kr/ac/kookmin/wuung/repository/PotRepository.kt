package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.Pot
import kr.ac.kookmin.wuung.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface PotRepository : JpaRepository<Pot, Long> {
    fun findPotByUser(user: User): Optional<Pot>
}