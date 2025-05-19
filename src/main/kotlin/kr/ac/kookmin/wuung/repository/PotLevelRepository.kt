
package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.PotLevel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface PotLevelRepository : JpaRepository<PotLevel, Long> {
    fun findPotLevelByLevel(level: Int): Optional<PotLevel>
}