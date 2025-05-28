package kr.ac.kookmin.wuung.service

import kr.ac.kookmin.wuung.controller.toDTO
import kr.ac.kookmin.wuung.model.QuestType
import kr.ac.kookmin.wuung.model.Quests
import kr.ac.kookmin.wuung.repository.QuestsRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.io.Serializable
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrNull


data class QuestsDTO(
    val id: Long,
    val type: QuestType,
    val name: String,
    val description: String,
    val target: Int,
    val step: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
): Serializable
fun Quests.toDTO() = QuestsDTO(
    id = this.id ?: 0,
    type = this.type,
    name = this.name,
    description = this.description,
    target = this.target,
    step = this.step,
    createdAt = this.createdAt,
    updatedAt = this.updatedAt
)

@Service
class QuestService(
    @Autowired private val questsRepository: QuestsRepository
) {
    @Cacheable(
        key = "'quest_list'",
        value = ["quest"]
    )
    fun getAll() = questsRepository.findAll().map { it.toDTO() }

    @Cacheable(
        key = "'quest'_#id",
        value = ["quest"]
    )
    fun getById(id: Long) = questsRepository.findById(id).getOrNull()?.toDTO()

    fun getByIdRaw(id: Long) = questsRepository.findById(id).getOrNull()

    @Cacheable(
        key = "'quest_type_' + #type",
        value = ["quest"]
    )
    fun getAllByType(type: QuestType) = questsRepository.findAllByType(type).map { it.toDTO() }

    @Cacheable(
        key = "'quest_type_' + #type + '_' + #step",
        value = ["quest"]
    )
    fun getByTypeAndStep(type: QuestType, step: Int) = questsRepository.findByTypeAndStep(type, step)
        .getOrNull()?.toDTO()
}