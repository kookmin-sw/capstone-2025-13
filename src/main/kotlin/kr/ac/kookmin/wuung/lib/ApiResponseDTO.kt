package kr.ac.kookmin.wuung.lib

data class ApiResponseDTO<T>(
    val error: Boolean = false,
    val message: String = "",
    val data: T? = null
)
