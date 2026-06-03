package com.github.gubbib.backend.Controller.BusNotification;

import com.github.gubbib.backend.DTO.BusNotification.BusStopResponseDTO;
import com.github.gubbib.backend.DTO.BusNotification.NextBusResponseDTO;
import com.github.gubbib.backend.DTO.BusNotification.ShuttleScheduleResponseDTO;
import com.github.gubbib.backend.DTO.Error.ErrorResponseDTO;
import com.github.gubbib.backend.Service.BusNotification.BusNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(
            summary = "정류장 목록 조회",
            description = "전체 버스 정류장 목록을 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "정류장 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = BusStopResponseDTO.class)
                    )
            )
    })
    @GetMapping("/bus-stops")
    public ResponseEntity<List<BusStopResponseDTO>> getAllBusStops() {

        return ResponseEntity.ok(
                busNotificationService.getAllBusStops()
        );
    }

    @Operation(
            summary = "정류장 시간표 조회",
            description = "선택한 정류장의 전체 셔틀버스 시간표를 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "시간표 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ShuttleScheduleResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 정류장",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            )
    })
    @GetMapping("/bus-stops/{busStopId}/schedules")
    public ResponseEntity<List<ShuttleScheduleResponseDTO>> getSchedules(
            @PathVariable Long busStopId
    ) {

        return ResponseEntity.ok(
                busNotificationService.getSchedules(busStopId)
        );
    }

    @Operation(
            summary = "다음 버스 조회",
            description = "현재 시간을 기준으로 가장 가까운 다음 버스와 남은 시간을 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "다음 버스 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = NextBusResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 정류장",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "오늘 운행 종료",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            )
    })
    @GetMapping("/bus-stops/{busStopId}/next")
    public ResponseEntity<NextBusResponseDTO> getNextBus(
            @PathVariable Long busStopId
    ) {

        return ResponseEntity.ok(
                busNotificationService.getNextBus(busStopId)
        );
    }
}