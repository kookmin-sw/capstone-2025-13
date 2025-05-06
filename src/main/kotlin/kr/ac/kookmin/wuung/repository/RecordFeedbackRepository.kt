package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.Record
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import kr.ac.kookmin.wuung.model.RecordFeedback
import kr.ac.kookmin.wuung.model.RecordFeedbackStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import java.util.Optional

@Repository
interface RecordFeedbackRepository : JpaRepository<RecordFeedback, String>{
    fun findRecordFeedbackByRecord(record: Record): List<RecordFeedback>
    fun findRecordFeedbackById(id: String): Optional<RecordFeedback>
    fun findRecordFeedbackByStatus(status: RecordFeedbackStatus): Optional<RecordFeedback>
    fun findRecordFeedbacksByStatus(status: RecordFeedbackStatus, page: Pageable): Page<RecordFeedback>
}