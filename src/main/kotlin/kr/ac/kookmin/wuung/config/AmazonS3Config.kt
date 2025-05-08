package kr.ac.kookmin.wuung.config

import com.amazonaws.auth.AWSStaticCredentialsProvider
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class AmazonS3Config(
    @Value("\${s3.url}") private val s3Url: String,
    @Value("\${s3.access-key}") private val s3AccessKey: String,
    @Value("\${s3.secret-key}") private val s3SecretKey: String,
) {
    @Bean
    fun profileS3Client(): AmazonS3 {
        val credentials = BasicAWSCredentials(s3AccessKey, s3SecretKey)
        val endpoint = com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration(
            s3Url,
            "us-east-1"
        )

        return AmazonS3ClientBuilder
            .standard()
            .withCredentials(AWSStaticCredentialsProvider(credentials))
            .withEndpointConfiguration(endpoint)
            .withPathStyleAccessEnabled(true)
            .build()
    }
}