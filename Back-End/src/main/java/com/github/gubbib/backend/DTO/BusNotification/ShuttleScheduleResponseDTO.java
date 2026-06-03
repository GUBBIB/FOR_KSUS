package com.github.gubbib.backend.DTO.BusNotification;

import com.github.gubbib.backend.Domain.ShuttleSchedule.ShuttleSchedule;

public record ShuttleScheduleResponseDTO(
        Long id,
        String departureTime
) {

    public static ShuttleScheduleResponseDTO from(
            ShuttleSchedule shuttleSchedule
    ) {
        return new ShuttleScheduleResponseDTO(
                shuttleSchedule.getId(),
                shuttleSchedule.getDepartureTime().toString()
        );
    }
}