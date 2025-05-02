package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.Record
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import kr.ac.kookmin.wuung.model.RecordFeedback

@Repository
interface RecordFeedbackRepository : JpaRepository<RecordFeedback, String>{
    fun findRecordFeedbackByRecord(record: Record): List<RecordFeedback>
}