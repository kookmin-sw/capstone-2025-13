package kr.ac.kookmin.wuung.service

import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.model.ObjectMetadata
import io.jsonwebtoken.io.IOException
import kr.ac.kookmin.wuung.exceptions.ServerErrorException
import kr.ac.kookmin.wuung.model.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class ProfileS3Service(
    @Autowired @Qualifier("amazonS3Client") private val s3Client: AmazonS3,
    @Value("\${s3.profile-bucket}") private val bucketName: String,
) {
    fun uploadProfile(user: User, file: MultipartFile): String {
        val originalFilename = file.originalFilename ?: throw RuntimeException("originalFilename is null")
        val ext = originalFilename.substringAfterLast('.', "")

        val s3Path = "profile/${user.id}.${ext}"

        try {
            val metadata = ObjectMetadata()
            metadata.contentLength = file.size
            metadata.contentType = file.contentType

            s3Client.putObject(bucketName, s3Path, file.inputStream, metadata)

            return s3Path
        } catch(e: IOException) {
            throw ServerErrorException()
        }
    }

    fun removeProfile(user: User) {
        val s3Path = user.profile ?: return
        s3Client.deleteObject(bucketName, s3Path)
    }
}