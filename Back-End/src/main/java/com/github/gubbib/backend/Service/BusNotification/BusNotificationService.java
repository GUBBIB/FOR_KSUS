package com.github.gubbib.backend.Service.BusNotification;

import com.github.gubbib.backend.DTO.BusNotification.BusStopResponseDTO;
import com.github.gubbib.backend.DTO.BusNotification.NextBusResponseDTO;
import com.github.gubbib.backend.DTO.BusNotification.ShuttleScheduleResponseDTO;

import java.util.List;

public interface BusNotificationService {

    List<BusStopResponseDTO> getAllBusStops();
    List<ShuttleScheduleResponseDTO> getSchedules(Long busStopId);
    NextBusResponseDTO getNextBus(Long busStopId);

}