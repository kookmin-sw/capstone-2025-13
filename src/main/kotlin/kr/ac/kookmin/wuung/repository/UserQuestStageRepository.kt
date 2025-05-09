package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.QuestType
import kr.ac.kookmin.wuung.model.UserQuestStages
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import kr.ac.kookmin.wuung.model.User

@Repository
interface UserQuestStageRepository : JpaRepository<UserQuestStages, String> {
    fun findByUser(user : User) : MutableList<UserQuestStages>
    fun findByUserAndType(user : User, type : QuestType) : UserQuestStages?
}