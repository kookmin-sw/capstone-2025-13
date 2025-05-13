package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.LifeQuotes
import kr.ac.kookmin.wuung.model.Quests
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository


@Repository
interface LifeQuoteRepository: JpaRepository<LifeQuotes, Long> {
    fun findLifeQuotesById(id: Long): LifeQuotes
}