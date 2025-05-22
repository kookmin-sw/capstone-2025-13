package kr.ac.kookmin.wuung.service

import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.model.ObjectMetadata
import io.jsonwebtoken.io.IOException
import kr.ac.kookmin.wuung.exceptions.ServerErrorException
import kr.ac.kookmin.wuung.model.User
import kr.ac.kookmin.wuung.model.UserQuests
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class UserQuestS3Service (
    @Autowired private val userQuestS3Client: AmazonS3,
    @Value("\${s3.quest-bucket}") private val bucketName: String,
) {
    fun uploadPhoto(quest: UserQuests, file: MultipartFile): String {
            val originalFilename = file.originalFilename ?: throw RuntimeException("originalFilename is null")
            val ext = originalFilename.substringAfterLast('.', "")

            val s3Path = "quest/${quest.id}.${ext}"

            try {
                val metadata = ObjectMetadata()
                metadata.contentLength = file.size
                metadata.contentType = file.contentType

                userQuestS3Client.putObject(bucketName, s3Path, file.inputStream, metadata)

                return s3Path
            } catch(e: IOException) {
                throw ServerErrorException()
            }
        }

        fun removePhoto(quest: UserQuests) {
            val s3Path = quest.photo ?: return
            userQuestS3Client.deleteObject(bucketName, s3Path)
        }
}