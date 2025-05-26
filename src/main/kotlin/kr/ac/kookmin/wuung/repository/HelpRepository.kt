package kr.ac.kookmin.wuung.repository

import org.springframework.data.jpa.repository.JpaRepository
import kr.ac.kookmin.wuung.model.Help
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.Optional


interface HelpRepository : JpaRepository<Help, Long>{
    @Query(
        value = """
    WITH point AS (
        SELECT ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography AS ref_point
    )
    SELECT h.*,
           ST_Distance(h.location::geography, p.ref_point) as distance
    FROM help h, point p
    WHERE ST_DWithin(
        h.location::geography, 
        p.ref_point, 
        :distance
    )
    ORDER BY ST_Distance(h.location::geography, p.ref_point)
    LIMIT 10
""", nativeQuery = true)
    fun findNearbyHelp(
        @Param("latitude") latitude: Double,
        @Param("longitude") longitude: Double,
        @Param("distance") distance: Double
    ): List<Help>

    fun findHelpByHpCnterNm(hpCntNm: String): Optional<Help>
}