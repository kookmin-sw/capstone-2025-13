package kr.ac.kookmin.wuung.lib

import java.util.Date

fun Date.toLocalDateTime() = this.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime()