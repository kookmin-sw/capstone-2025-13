package kr.ac.kookmin.wuung.service

import io.jsonwebtoken.io.IOException
import kr.ac.kookmin.wuung.exceptions.ServerErrorException
import kr.ac.kookmin.wuung.model.UserQuests
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest
import software.amazon.awssdk.services.s3.model.PutObjectRequest


@Service
class UserQuestS3Service (
    @Autowired private val s3Client: S3Client,
    @Value("\${s3.quest-bucket}") private val bucketName: String,
) {
    fun uploadPhoto(quest: UserQuests, file: MultipartFile): String {
        val originalFilename = file.originalFilename ?: throw RuntimeException("originalFilename is null")
        val ext = originalFilename.substringAfterLast('.', "")

        val s3Path = "quest/${quest.id}.${ext}"

        try {
            val putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Path)
                .contentType(file.contentType)
                .contentLength(file.size)
                .build()

            s3Client.putObject(putRequest, RequestBody.fromInputStream(file.inputStream, file.size))

            return s3Path
        } catch (e: IOException) {
            throw ServerErrorException()
        }
    }

    fun removePhoto(quest: UserQuests) {
        val s3Path = quest.photo ?: return

        try {
            val deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Path)
                .build()
            s3Client.deleteObject(deleteRequest)
        } catch (e: Exception) {
            throw ServerErrorException()
        }
    }
}
