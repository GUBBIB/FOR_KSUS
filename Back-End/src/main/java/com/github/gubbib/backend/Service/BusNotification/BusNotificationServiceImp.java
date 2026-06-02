package com.github.gubbib.backend.Service.BusNotification;

import com.github.gubbib.backend.DTO.BusNotification.BusStopResponseDTO;
import com.github.gubbib.backend.DTO.BusNotification.NextBusResponseDTO;
import com.github.gubbib.backend.DTO.BusNotification.ShuttleScheduleResponseDTO;
import com.github.gubbib.backend.Domain.BusStop.BusStop;
import com.github.gubbib.backend.Domain.ShuttleSchedule.ShuttleSchedule;
import com.github.gubbib.backend.Exception.ErrorCode;
import com.github.gubbib.backend.Exception.GlobalException;
import com.github.gubbib.backend.Repository.BusNotification.BusStopRepository;
import com.github.gubbib.backend.Repository.BusNotification.ShuttleScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class BusNotificationServiceImp
        implements BusNotificationService {

    private final BusStopRepository busStopRepository;
    private final ShuttleScheduleRepository shuttleScheduleRepository;

    @Override
    public List<BusStopResponseDTO> getAllBusStops() {

        return busStopRepository.findAll()
                .stream()
                .map(BusStopResponseDTO::from)
                .toList();
    }

    @Override
    public List<ShuttleScheduleResponseDTO> getSchedules(Long busStopId) {

        existsBusStop(busStopId);

        return shuttleScheduleRepository
                .findByBusStopIdOrderByDepartureTimeAsc(
                        busStopId
                )
                .stream()
                .map(ShuttleScheduleResponseDTO::from)
                .toList();
    }

    @Override
    public NextBusResponseDTO getNextBus(Long busStopId) {

        existsBusStop(busStopId);

        LocalTime now = LocalTime.now();

        ShuttleSchedule nextBus =
                shuttleScheduleRepository
                        .findByBusStopIdOrderByDepartureTimeAsc(
                                busStopId
                        )
                        .stream()
                        .filter(schedule ->
                                !schedule.getDepartureTime()
                                        .isBefore(now)
                        )
                        .findFirst()
                        .orElseThrow(() ->
                                new GlobalException(
                                        ErrorCode.BUS_SERVICE_ENDED
                                )
                        );

        long remainingMinutes =
                Duration.between(
                        now,
                        nextBus.getDepartureTime()
                ).toMinutes();

        return new NextBusResponseDTO(
                nextBus.getDepartureTime().toString(),
                remainingMinutes
        );
    }

    private BusStop existsBusStop(
            Long busStopId
    ) {

        return busStopRepository.findById(
                        busStopId
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "정류장 없음"
                        )
                );
    }
}