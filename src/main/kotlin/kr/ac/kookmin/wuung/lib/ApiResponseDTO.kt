package kr.ac.kookmin.wuung.lib

data class ApiResponseDTO<T>(
    val error: Boolean = false,
    val message: String = "",
    val code: Int = 200,
    val data: T? = null
)
