package kr.ac.kookmin.wuung.cron

import kr.ac.kookmin.wuung.repository.HelpRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.web.reactive.function.client.WebClient
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import kr.ac.kookmin.wuung.model.Help
import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.GeometryFactory
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.time.LocalTime
import jakarta.annotation.PostConstruct

@Component
class UpdateHelpCenter(
    @Autowired private val helpRepository: HelpRepository,
    @Autowired private val webClient: WebClient,
    @Value("\${etc.openapi}") private val serviceKey: String
) {
    private val logger = org.slf4j.LoggerFactory.getLogger(this::class.java)

    // @PostConstruct
    @Scheduled(cron = "0 8 16 * * ?")
    fun updateHelpCenter() {
        var pageNo = 1
        val numOfRows = 1000

        while (true) {
            val response = webClient.get()
                .uri(
                    "http://api.data.go.kr/openapi/tn_pubr_public_hp_cnter_api?serviceKey={serviceKey}&pageNo={pageNo}&numOfRows={numOfRows}&type=json",
                    serviceKey,
                    pageNo,
                    numOfRows
                )
                .retrieve()
                .bodyToMono(String::class.java)
                .block()?.let { jsonString ->
                    logger.info("pageNo: $pageNo")
                    logger.info(jsonString)
                    val mapper = ObjectMapper()
                    val apiResponse: ApiResponse = mapper.readValue(jsonString)

                    if (apiResponse.response.body.items.isNotEmpty()) apiResponse.response.body.items.forEach {
                    helpRepository.findHelpByHpCnterNm(it.hpCnterNm).ifPresent { center ->
                            helpRepository.delete(center)
                        }
                        
                        val point = GeometryFactory().createPoint(Coordinate(it.longitude, it.latitude))
                        val center = Help(
                            hpCnterNm = it.hpCnterNm,
                            hpCnterSe = it.hpCnterSe,
                            rdnmadr = it.rdnmadr,
                            lnmadr = it.lnmadr,
                            latitude = it.latitude,
                            longitude = it.longitude,
                            location = point,
                            hpCnterJob = it.hpCnterJob,
                            operOpenHhmm = LocalTime.parse(it.operOpenHhmm),
                            operCloseHhmm = LocalTime.parse(it.operColseHhmm),
                            rstdeInfo = it.rstdeInfo,
                            hpCnterAr = it.hpCnterAr.toInt(),
                            doctrCo = it.doctrCo,
                            nurseCo = it.nurseCo,
                            scrcsCo = it.scrcsCo,
                            ntrstCo = it.ntrstCo,
                            etcHnfSttus = it.etcHnfSttus,
                            etcUseIfno = it.etcUseIfno,
                            operPhoneNumber = it.operPhoneNumber,
                            operInstitutionNm = it.operInstitutionNm,
                            phoneNumber = it.phoneNumber,
                            institutionNm = it.institutionNm,
                            referenceDate = LocalDateTime.parse(it.referenceDate),
                            instt_code = it.insttCode,
                            instt_nm = it.insttNm,
                            createdAt = LocalDateTime.now(),
                            updatedAt = LocalDateTime.now(),
                        )
                        
                        helpRepository.save(center)
                    }
                    pageNo++
                } ?: break
        }
    }
}

data class ApiResponse(
    val response: ResponseBody,
)

data class ResponseBody(
    val body: Body,
)

data class Body(
    val items: List<Response>,
)

data class Response(
    val hpCnterNm: String,
    val hpCnterSe: String,
    val rdnmadr: String,
    val lnmadr: String,
    val latitude: Double,
    val longitude: Double,
    val hpCnterJob: String,
    val operOpenHhmm: String,
    val operColseHhmm: String,
    val rstdeInfo: String,
    val hpCnterAr: Double,
    val doctrCo: Int,
    val nurseCo: Int,
    val scrcsCo: Int,
    val ntrstCo: Int,
    val etcHnfSttus: String,
    val etcUseIfno: String,
    val operPhoneNumber: String,
    val operInstitutionNm: String,
    val phoneNumber: String,
    val institutionNm: String,
    val referenceDate: String,
    val insttCode: String,
    val insttNm: String,
)