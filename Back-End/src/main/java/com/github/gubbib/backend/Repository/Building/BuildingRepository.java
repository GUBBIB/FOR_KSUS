package com.github.gubbib.backend.Repository.Building;

import com.github.gubbib.backend.DTO.Building.BuildingResponseDTO;
import com.github.gubbib.backend.Domain.Building.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BuildingRepository extends JpaRepository<Building, Long> {
    Optional<Building> findByName(String name);

    @Query(value = """
        SELECT 
            b.id,
            b.name,
            b.full_name
        FROM buildings b
        ORDER BY 
            IF(
                b.name REGEXP '^[0-9]+',
                CAST(REGEXP_SUBSTR(b.name, '^[0-9]+') AS UNSIGNED),
                9999
            ),
            b.name
    """, nativeQuery = true)
    List<Object[]> findAllBuildingsRaw();
}