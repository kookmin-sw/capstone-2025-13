package kr.ac.kookmin.wuung.service

import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.model.ObjectMetadata
import io.jsonwebtoken.io.IOException
import kr.ac.kookmin.wuung.exceptions.ServerErrorException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class UserQuestImageS3Service(
    @Autowired private val userQuestImageS3Client: AmazonS3,
    @Value("\${s3.quest-image-bucket}") private val bucketName: String,
) {
    fun uploadImage(imageId: String, file: MultipartFile): String {
        val originalFilename = file.originalFilename ?: throw RuntimeException("originalFilename is null")
        val ext = originalFilename.substringAfterLast('.', "")
        val s3Path = "quest-images/${imageId}.${ext}"

        try {
            val metadata = ObjectMetadata()
            metadata.contentLength = file.size
            metadata.contentType = file.contentType

            userQuestImageS3Client.putObject(bucketName, s3Path, file.inputStream, metadata)
            return s3Path
        } catch(e: IOException) {
            throw ServerErrorException()
        }
    }

    fun downloadImage(imageId: String): ByteArray {
        val s3Object = userQuestImageS3Client.getObject(bucketName, "quest-images/${imageId}")
        return s3Object.objectContent.readBytes()
    }

    fun deleteImage(imageId: String) {
        userQuestImageS3Client.deleteObject(bucketName, "quest-images/${imageId}")
    }
}