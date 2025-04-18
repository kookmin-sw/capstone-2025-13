package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.model.UserQuests

interface UserQuestsRepository {
    fun findByUser(user: User): List<UserQuests>
}