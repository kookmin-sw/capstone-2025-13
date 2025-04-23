package kr.ac.kookmin.wuung.security

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.FilterChain
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
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            filterChain.doFilter(request, response)
        } catch (e: CustomException) {
            handleCustomException(response, e)
        } catch (e: RuntimeException) {
            handleCustomException(response, ServerErrorException())
        }
    }

    private fun handleCustomException(
        response: HttpServletResponse,
        error: CustomException
    ) {
        response.status = error.status
        response.contentType = MediaType.APPLICATION_JSON_VALUE
        val errorResponse = ApiResponseDTO<String>(
            error = true,
            message = error.message,
            code = error.status
        )

        try {
            response.writer.write(objectMapper.writeValueAsString(errorResponse))
        } catch(e: IOException) {
            logger.error("응답 작성 중 오류 발생", e)
        }
    }
}
