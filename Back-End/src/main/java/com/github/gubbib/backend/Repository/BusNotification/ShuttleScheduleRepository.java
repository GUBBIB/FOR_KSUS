package com.github.gubbib.backend.Repository.BusNotification;

import com.github.gubbib.backend.Domain.ShuttleSchedule.ShuttleSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShuttleScheduleRepository extends JpaRepository<ShuttleSchedule, Long> {
    List<ShuttleSchedule> findByBusStopIdOrderByDepartureTimeAsc(Long busStopId);
}
