package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.model.UserQuestImages
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface UserQuestImageRepository : JpaRepository<UserQuestImages, String> {
    fun findByUserAndCreatedAtBetween(
        user: User,  // String에서 User로 타입 변경
        start: LocalDateTime,
        end: LocalDateTime
    ): List<UserQuestImages>

}