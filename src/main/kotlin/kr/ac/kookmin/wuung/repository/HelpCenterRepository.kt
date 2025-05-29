package kr.ac.kookmin.wuung.repository

import org.springframework.data.jpa.repository.JpaRepository
import kr.ac.kookmin.wuung.model.Help
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.Optional


interface HelpCenterRepository : JpaRepository<Help, Long>{
    @Query(
        value = """
        select *, 
           ST_Distance(
             location::geometry,
             ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
           ) AS distance
        from help_center
        where ST_DWITHIN(
            location::geometry,
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
            (:distance)::double precision
        )
        ORDER BY distance
        limit 100;
    """, nativeQuery = true)
    fun findNearbyHelp(
        @Param("latitude") latitude: Double,
        @Param("longitude") longitude: Double,
        @Param("distance") distance: Int
    ): List<Help>

    fun findHelpByHpCnterNm(hpCntNm: String): Optional<Help>
}