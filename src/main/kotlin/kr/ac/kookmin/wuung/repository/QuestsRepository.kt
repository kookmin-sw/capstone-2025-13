package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.QuestType
import kr.ac.kookmin.wuung.model.Quests
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface QuestsRepository: JpaRepository<Quests, Long> {
    fun findAllByType(type: QuestType): List<Quests>
    fun findByTypeAndStep(type: QuestType, step: Int): Optional<Quests>
}