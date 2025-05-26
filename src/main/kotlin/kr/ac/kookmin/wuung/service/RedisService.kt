package kr.ac.kookmin.wuung.service

import com.fasterxml.jackson.databind.ObjectMapper
import kr.ac.kookmin.wuung.controller.HelpDTO
import kr.ac.kookmin.wuung.model.Help
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit

@Service
class RedisService(
    private val redisTemplate: RedisTemplate<String, String>,
    private val objectMapper: ObjectMapper
) {
    private val HOSPITAL_CACHE_PREFIX = "hospital:"
    private val CACHE_DURATION = 43200L // 캐시 유효 시간 (분) 1달로 정의해둠.

    fun getCachedHospitals(latitude: Double, longitude: Double): List<HelpDTO>? {
        val key = generateKey(latitude, longitude)
        val cachedData = redisTemplate.opsForValue().get(key) ?: return null
        return objectMapper.readValue(cachedData,
            objectMapper.typeFactory.constructCollectionType(List::class.java, HelpDTO::class.java))
    }

    fun cacheHospitals(latitude: Double, longitude: Double, hospitals: List<HelpDTO>) {
        val key = generateKey(latitude, longitude)
        val value = objectMapper.writeValueAsString(hospitals)
        redisTemplate.opsForValue().set(key, value, CACHE_DURATION, TimeUnit.MINUTES)
    }

private fun generateKey(latitude: Double, longitude: Double): String {
    // 소수점 2자리까지만 사용 (약 1.11km 반경)
    return "${HOSPITAL_CACHE_PREFIX}${String.format("%.2f", latitude)}:${String.format("%.2f", longitude)}"
}
}