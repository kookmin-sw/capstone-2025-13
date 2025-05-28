package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.Topic
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import kr.ac.kookmin.wuung.model.TopicFeedbackStatus
import kr.ac.kookmin.wuung.model.TopicFeedback
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import java.time.LocalDateTime
import java.util.Optional

@Repository
interface TopicFeedbackRepository : JpaRepository<TopicFeedback, String>{
    fun findTopicFeedbackByTopic(record: Topic): List<TopicFeedback>
    fun findTopicFeedbackById(id: String): Optional<TopicFeedback>
    fun findTopicFeedbackByStatus(status: TopicFeedbackStatus): Optional<TopicFeedback>
    fun findTopicFeedbacksByStatus(status: TopicFeedbackStatus, page: Pageable): Page<TopicFeedback>
    //fun findTopicFeedbacksByCreatedAtBetweenAndStatus(start : LocalDateTime, end : LocalDateTime, status : TopicFeedbackStatus): List<TopicFeedback>
}