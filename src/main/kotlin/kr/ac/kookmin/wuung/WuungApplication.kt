package kr.ac.kookmin.wuung

import io.github.cdimascio.dotenv.dotenv
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

val dotenv = dotenv {
	ignoreIfMissing = true
}

@SpringBootApplication
@EnableScheduling
class WuungApplication

fun main(args: Array<String>) {
	val envVars = mapOf(
		"DB_HOST" to dotenv["DB_HOST"],
		"DB_PORT" to dotenv["DB_PORT"],
		"DB_NAME" to dotenv["DB_NAME"],
		"DB_USER" to dotenv["DB_USER"],
		"DB_PASSWORD" to dotenv["DB_PASSWORD"],
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
	)

	runApplication<WuungApplication>(*args) {
		setDefaultProperties(envVars)
	}
}
