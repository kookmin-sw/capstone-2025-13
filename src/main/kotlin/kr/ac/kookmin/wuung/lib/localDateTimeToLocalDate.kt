package kr.ac.kookmin.wuung.lib

import java.time.LocalDateTime
import java.time.LocalDate

fun LocalDateTime.toLocalDate() = LocalDate.of(year, month, dayOfMonth)