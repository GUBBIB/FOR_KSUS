package com.github.gubbib.backend.Service.Building;

import com.github.gubbib.backend.DTO.Building.BuildingResponseDTO;
import com.github.gubbib.backend.Repository.Building.BuildingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional(readOnly=true)
@RequiredArgsConstructor(onConstructor_ =  @Autowired)
public class BuildingServiceImp implements BuildingService{

    private final BuildingRepository buildingRepository;

    @Override
    public List<BuildingResponseDTO> getAllBuildings() {
        return buildingRepository.findAllBuildingsRaw()
                .stream()
                .map(row -> new BuildingResponseDTO(
                        ((Number) row[0]).longValue(),
                        (String) row[1],
                        (String) row[2]
                ))
                .toList();
    }
}
