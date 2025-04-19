package kr.ac.kookmin.wuung.exceptions

open class CustomException(override val message: String, val status: Int) : RuntimeException(message)
class JwtExpiredException : CustomException("Jwt Token Expired", 401)
class NotFoundException :  CustomException("Resource not found", 404)
class UnauthorizedException : CustomException("Unauthorized", 401)
class ServerErrorException : CustomException("Internal Server Error", 500)