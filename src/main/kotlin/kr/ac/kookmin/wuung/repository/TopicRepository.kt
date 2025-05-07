package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import kr.ac.kookmin.wuung.model.Topic

@Repository
interface TopicRepository : JpaRepository<Topic, String>{
    fun findByUserAndCreatedAtBetween(
        user: User,
        start: LocalDateTime,
        end: LocalDateTime
    ): List<Topic>
    fun findByUserAndCreatedAtBetweenOrderByCreatedAtDesc(
        user: User,
        start: LocalDateTime,
        end: LocalDateTime
    ): List<Topic>
}