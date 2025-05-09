package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.QuestType
import kr.ac.kookmin.wuung.model.UserQuestStage
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import kr.ac.kookmin.wuung.model.User

@Repository
interface UserQuestStageRepository : JpaRepository<UserQuestStage, String> {
    fun findByUser(user : User)
    fun findByUserAndType(user : User, type : QuestType)
}