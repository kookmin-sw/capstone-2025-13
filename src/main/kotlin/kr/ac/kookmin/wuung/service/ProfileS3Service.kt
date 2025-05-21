package kr.ac.kookmin.wuung.service

import io.jsonwebtoken.io.IOException
import kr.ac.kookmin.wuung.exceptions.ServerErrorException
import kr.ac.kookmin.wuung.model.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest
import software.amazon.awssdk.services.s3.model.PutObjectRequest


@Service
class ProfileS3Service(
    @Autowired @Qualifier("amazonS3") private val s3Client: S3Client,
    @Value("\${s3.profile-bucket}") private val bucketName: String,
) {
    fun uploadProfile(user: User, file: MultipartFile): String {
        val originalFilename = file.originalFilename ?: throw RuntimeException("originalFilename is null")
        val ext = originalFilename.substringAfterLast('.', "")

        val s3Path = "quest/${user.id}.${ext}"

        try {
            val putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Path)
                .contentType(file.contentType)
                .contentLength(file.size)
                .build()

            s3Client.putObject(putRequest, RequestBody.fromInputStream(file.inputStream, file.size))

            return s3Path
        } catch(e: IOException) {
            throw ServerErrorException()
        }
    }

    fun removeProfile(user: User) {
        val s3Path = user.profile ?: return

        try {
            val deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Path)
                .build()
            s3Client.deleteObject(deleteRequest)
        } catch(e: Exception) {
            throw ServerErrorException()
        }
    }
}