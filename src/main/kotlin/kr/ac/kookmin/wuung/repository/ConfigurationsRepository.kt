package kr.ac.kookmin.wuung.repository

import kr.ac.kookmin.wuung.model.ConfigurationKey
import kr.ac.kookmin.wuung.model.Configurations
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface ConfigurationsRepository: JpaRepository<Configurations, Long> {
    fun findByKey(key: ConfigurationKey): Optional<Configurations>
}