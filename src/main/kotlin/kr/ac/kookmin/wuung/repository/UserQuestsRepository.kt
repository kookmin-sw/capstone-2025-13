package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.Quests
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.model.UserQuests
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface UserQuestsRepository: JpaRepository<UserQuests, String> {
    fun findByUserAndCreatedAtAfter(user: User, startDate: LocalDateTime): List<UserQuests>
    fun findByUser(user: User): List<UserQuests>
    fun findByUserAndCreatedAtBetween(user: User, start: LocalDateTime, end: LocalDateTime): List<UserQuests>
}