package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.Topic
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import kr.ac.kookmin.wuung.model.RecordFeedbackStatus
import kr.ac.kookmin.wuung.model.TopicFeedback
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import java.util.Optional

@Repository
interface TopicFeedbackRepository : JpaRepository<TopicFeedback, String>{
    fun findRecordFeedbackByTopic(record: Topic): List<TopicFeedback>
    fun findRecordFeedbackById(id: String): Optional<TopicFeedback>
    fun findRecordFeedbackByStatus(status: RecordFeedbackStatus): Optional<TopicFeedback>
    fun findRecordFeedbacksByStatus(status: RecordFeedbackStatus, page: Pageable): Page<TopicFeedback>
}