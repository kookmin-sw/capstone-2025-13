package kr.ac.kookmin.wuung.controller

import io.swagger.v3.oas.annotations.tags.Tag
import kr.ac.kookmin.wuung.service.DiagnosisService
import kr.ac.kookmin.wuung.service.TokenService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

// Diagnosis 생성 Request 할때 토큰, 결과값, 시간
// Response는 그냥 상태값

// Diagnosis 읽기 Request 할 때 토큰, 검사 타입
// Response는 Diagnosis 전체 검사 결과 리스트
// 근데 create랑 read랑 다루는 데이터의 범위가 다른데 괜찮은가? 함 상의해보자.

@RestController
@RequestMapping("/daignosis")
@Tag(name = "Diagnosis API", description = "Endpoints for Diagnosis create and read data")
class DiagnosisController(
    @Autowired private val diagnosisService: DiagnosisService,
    @Autowired private val tokenService : TokenService
)
{
    // createDiagnosis
    // readDiagnosis
}