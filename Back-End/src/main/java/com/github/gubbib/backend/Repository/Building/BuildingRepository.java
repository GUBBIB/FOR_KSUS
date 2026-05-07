package com.github.gubbib.backend.Repository.Building;

import com.github.gubbib.backend.Domain.Building.Building;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BuildingRepository extends JpaRepository<Building, Long> {
    Optional<Building> findByName(String name);
}