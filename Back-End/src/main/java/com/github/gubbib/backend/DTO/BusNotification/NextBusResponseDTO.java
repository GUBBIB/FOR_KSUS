package com.github.gubbib.backend.DTO.BusNotification;

public record NextBusResponseDTO(
        String departureTime,
        long remainingMinutes
) {
}