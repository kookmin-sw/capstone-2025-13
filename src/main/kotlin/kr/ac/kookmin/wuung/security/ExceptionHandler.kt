package kr.ac.kookmin.wuung.security

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import kr.ac.kookmin.wuung.exceptions.CustomException
import kr.ac.kookmin.wuung.exceptions.ServerErrorException
import kr.ac.kookmin.wuung.lib.ApiResponseDTO
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException

@Component
class ExceptionHandlerFilter(private val objectMapper: ObjectMapper) : OncePerRequestFilter() {

    companion object {
        private const val ERROR_WRITING_RESPONSE = "Error on Exception Handling!"
        private const val JSON_MEDIA_TYPE = MediaType.APPLICATION_JSON_VALUE
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            filterChain.doFilter(request, response)
        } catch (e: CustomException) {
            println("${e.message}, status: ${e.status}")
            writeErrorResponse(response, e)
        } catch (e: RuntimeException) {
            writeErrorResponse(response, ServerErrorException())
        } catch(e: ServletException) {
            val cause = e.cause
            if (cause is CustomException) {
                writeErrorResponse(response, cause)
            } else {
                println(e.javaClass.name)
                println(e.stackTraceToString())
                writeErrorResponse(response, ServerErrorException())
            }
        } catch(e: Exception) {
            println(e.javaClass.name)
            println(e.stackTraceToString())
            writeErrorResponse(response, ServerErrorException())
        }
    }

    private fun writeErrorResponse(
        response: HttpServletResponse,
        error: CustomException,
    ) {
        response.status = error.status
        response.contentType = JSON_MEDIA_TYPE

        val errorResponse = createErrorResponseDto(error)

        try {
            response.writer.write(objectMapper.writeValueAsString(errorResponse))
        } catch(e: IOException) {
            logger.error(ERROR_WRITING_RESPONSE, e)
        }
    }

    private fun createErrorResponseDto(error: CustomException): ApiResponseDTO<String> {
        return ApiResponseDTO(
            error = true,
            message = error.message,
            code = error.status
        )
    }

    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        val excludePath = listOf("/admin", "/admin/**", "/login")

        return excludePath.any { request.requestURI.contains(it) }
    }
}
