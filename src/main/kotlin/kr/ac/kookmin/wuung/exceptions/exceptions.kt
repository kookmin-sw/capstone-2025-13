package kr.ac.kookmin.wuung.exceptions

open class CustomException(override val message: String, val status: Int) : RuntimeException(message)

class JwtExpiredException : CustomException("Jwt Token Expired", 401)
class NotFoundException :  CustomException("Resource not found", 404)
class UnauthorizedException : CustomException("Unauthorized", 401)
class ServerErrorException : CustomException("Internal Server Error", 500)
class BadRequestException : CustomException("Bad Request", 400)
class AlreadyExistException : CustomException("Already Exist", 409)

class IllegalArgumentException: CustomException("Illegal Argument", 400)

class AiFeedbackDuplicatedException : CustomException("Duplicated feedback requested", 409)
class AiFeedbackNotCompleteException : CustomException("AI Feedback is not complete", 202)
class AiFeedbackErrorException : CustomException("AI Feedback error raised", 500)
class RecordAlreadyCreatedException : CustomException("Record already created", 409)

class LimitReachedException : CustomException("Limit reached", 403)
class InvalidIssuerException : CustomException("Invalid Issuer", 403)
