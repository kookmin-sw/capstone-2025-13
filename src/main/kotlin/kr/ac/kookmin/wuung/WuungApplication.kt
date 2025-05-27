package kr.ac.kookmin.wuung

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.github.cdimascio.dotenv.dotenv
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.scheduling.annotation.EnableScheduling
import space.mori.dalbodeule.snapadmin.external.annotations.SnapAdminEnabled


val dotenv = dotenv {
	ignoreIfMissing = true
}

@SpringBootApplication
@EnableScheduling
@SnapAdminEnabled
@EnableCaching
@EnableJpaRepositories(basePackages = ["kr.ac.kookmin.wuung.repository"])
@EntityScan(basePackages = ["kr.ac.kookmin.wuung.model"])
class WuungApplication {
	@Bean
	@Primary
	fun objectMapper(): ObjectMapper {
		val mapper = jacksonObjectMapper()
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
		mapper.registerModule(JavaTimeModule())
		mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
		return mapper
	}
}

fun main(args: Array<String>) {
	val envVars = mapOf(
		"DB_HOST" to dotenv["DB_HOST"],
		"DB_PORT" to dotenv["DB_PORT"],
		"DB_NAME" to dotenv["DB_NAME"],
		"DB_USER" to dotenv["DB_USER"],
		"DB_PASSWORD" to dotenv["DB_PASSWORD"],
		"REDIS_HOST" to dotenv["REDIS_HOST"],
		"REDIS_PORT" to (dotenv["REDIS_PORT"]?.toInt() ?: 6379),
		"REDIS_DB" to (dotenv["REDIS_DB"]?.toInt() ?: 0),
		"REDIS_PASSWORD" to dotenv["REDIS_PASSWORD"],
		"JWT_SIGNING_KEY" to dotenv["JWT_SIGNING_KEY"],
		"JWT_VALIDATE_KEY" to dotenv["JWT_VALIDATE_KEY"],
		"HOST_NAME" to dotenv["HOST_NAME"],
		"S3_URI" to dotenv["S3_URI"],
		"S3_ACCESS_KEY" to dotenv["S3_ACCESS_KEY"],
		"S3_SECRET_KEY" to dotenv["S3_SECRET_KEY"],
		"S3_PROFILE_BUCKET" to dotenv["S3_PROFILE_BUCKET"],
		"S3_QUEST_BUCKET" to dotenv["S3_QUEST_BUCKET"],
		"S3_PUBLIC_ENDPOINT" to dotenv["S3_PUBLIC_ENDPOINT"],
		"GPT_API_KEY" to dotenv["GPT_API_KEY"],
		"GPT_BASE_URL" to (dotenv["GPT_BASE_URL"]?.let {
			if (!it.startsWith("http://") && !it.startsWith("https://")) "https://$it" else it
		} ?: "https://api.openai.com"),
		"JWT_ISSUER" to (dotenv["JWT_ISSUER"] ?: "localhost"),
		"PACKAGE_NAME" to dotenv["PACKAGE_NAME"],
		"GOOGLE_CLOUD_PROJECT_NUMBER" to dotenv["GOOGLE_CLOUD_PROJECT_NUMBER"],
		"GOOGLE_CLOUD_API_KEY" to dotenv["GOOGLE_CLOUD_API_KEY"],
		"GOOGLE_ACCOUNT_JSON" to dotenv["GOOGLE_ACCOUNT_JSON"],
		"APPLE_TEAM_ID" to dotenv["APPLE_TEAM_ID"],
		"APPLE_KEY_ID" to dotenv["APPLE_KEY_ID"],
		"OPENAPI_KEY" to dotenv["OPENAPI_KEY"],
	)

	runApplication<WuungApplication>(*args) {
		setDefaultProperties(envVars)
	}
}
