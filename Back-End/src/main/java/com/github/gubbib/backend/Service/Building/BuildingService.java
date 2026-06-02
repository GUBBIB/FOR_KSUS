package com.github.gubbib.backend.Service.Building;

import com.github.gubbib.backend.DTO.Building.BuildingResponseDTO;
import com.github.gubbib.backend.Domain.TimeTable.Building.Building;

import java.util.List;

public interface BuildingService {
    List<BuildingResponseDTO> getAllBuildings();
    Building existsBuilding(Long buildingId);
}
