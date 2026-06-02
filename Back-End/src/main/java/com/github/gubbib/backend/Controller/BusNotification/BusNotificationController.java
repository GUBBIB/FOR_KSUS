package com.github.gubbib.backend.Controller.BusNotification;

import com.github.gubbib.backend.DTO.BusNotification.BusStopResponseDTO;
import com.github.gubbib.backend.DTO.BusNotification.NextBusResponseDTO;
import com.github.gubbib.backend.DTO.BusNotification.ShuttleScheduleResponseDTO;
import com.github.gubbib.backend.Service.BusNotification.BusNotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/api/v1/bus-notifications")
@Tag(name = "버스 알림", description = "버스 알림 API")
public class BusNotificationController {

    private final BusNotificationService busNotificationService;

    @GetMapping("/bus-stops")
    public ResponseEntity<List<BusStopResponseDTO>> getAllBusStops() {

        return ResponseEntity.ok(
                busNotificationService.getAllBusStops()
        );
    }

    @GetMapping("/bus-stops/{busStopId}/schedules")
    public ResponseEntity<List<ShuttleScheduleResponseDTO>> getSchedules(
            @PathVariable Long busStopId
    ) {

        return ResponseEntity.ok(
                busNotificationService.getSchedules(busStopId)
        );
    }

    @GetMapping("/bus-stops/{busStopId}/next")
    public ResponseEntity<NextBusResponseDTO> getNextBus(
            @PathVariable Long busStopId
    ) {

        return ResponseEntity.ok(
                busNotificationService.getNextBus(busStopId)
        );
    }
}