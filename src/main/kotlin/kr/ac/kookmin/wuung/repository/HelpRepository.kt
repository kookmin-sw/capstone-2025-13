package kr.ac.kookmin.wuung.repository

import org.springframework.data.jpa.repository.JpaRepository
import kr.ac.kookmin.wuung.model.Help
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param


interface HelpRepository : JpaRepository<Help, Long>{
    @Query("""
        SELECT h FROM Help h 
        WHERE ST_DWithin(
            h.location, 
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), 
            :distance
        ) = true
        ORDER BY ST_Distance(
            h.location, 
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
        )
        LIMIT 10
    """)
    fun findNearbyHelp(
        @Param("latitude") latitude: Double,
        @Param("longitude") longitude: Double,
        @Param("distance") distance: Double
    ): List<Help>

}