package com.github.gubbib.backend.DTO.Building;

import com.github.gubbib.backend.Domain.Building.Building;

public record BuildingResponseDTO (
        Long id,
        String name,
        String fullName
){
    public static BuildingResponseDTO from(Building b){
        return new BuildingResponseDTO(
                b.getId(),
                b.getName(),
                b.getFullName()
        );
    }
}
