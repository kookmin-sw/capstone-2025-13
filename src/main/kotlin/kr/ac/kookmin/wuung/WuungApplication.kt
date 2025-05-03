package kr.ac.kookmin.wuung

import io.github.cdimascio.dotenv.dotenv
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
		"S3_PUBLIC_ENDPOINT" to dotenv["S3_PUBLIC_ENDPOINT"],
	)

	runApplication<WuungApplication>(*args) {
		setDefaultProperties(envVars)
	}
}
