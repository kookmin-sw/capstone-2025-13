package kr.ac.kookmin.wuung.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.services.s3.S3Client
import java.net.URI


@Configuration
class AmazonS3Config(
    @Value("\${s3.url}") private val s3Url: String,
    @Value("\${s3.access-key}") private val s3AccessKey: String,
    @Value("\${s3.secret-key}") private val s3SecretKey: String,
) {
    @Bean
    open fun amazonS3(): S3Client {
        require(s3AccessKey.isNotBlank() && s3SecretKey.isNotBlank()) { "AWS credentials cannot be blank" }
        require(s3Url.isNotBlank()) { "S3 URL cannot be blank" }

        val credentials = try {
            AwsBasicCredentials.create(s3AccessKey, s3SecretKey)
        } catch (e: Exception) {
            throw IllegalStateException("Failed to create AWS credentials", e)
        }

        return S3Client.builder()
            .credentialsProvider(StaticCredentialsProvider.create(credentials))
            .endpointOverride(URI.create(s3Url))
            .forcePathStyle(true)
            .build()
    }
}