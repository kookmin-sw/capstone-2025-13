package kr.ac.kookmin.wuung.lib

import java.time.LocalDateTime

fun String.datetimeParser() = LocalDateTime.parse(this + "T00:00:00")