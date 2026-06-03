package com.github.gubbib.backend.DTO.BusNotification;

import com.github.gubbib.backend.Domain.BusStop.BusStop;

public record BusStopResponseDTO(
        Long id,
        String name
) {
    public static BusStopResponseDTO from(BusStop busStop) {
        return new BusStopResponseDTO(
                busStop.getId(),
                busStop.getName()
        );
    }
}