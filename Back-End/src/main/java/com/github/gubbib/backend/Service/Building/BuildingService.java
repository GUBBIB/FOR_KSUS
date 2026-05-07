package com.github.gubbib.backend.Service.Building;

import com.github.gubbib.backend.DTO.Building.BuildingResponseDTO;

import java.util.List;

public interface BuildingService {
    List<BuildingResponseDTO> getAllBuildings();
}
