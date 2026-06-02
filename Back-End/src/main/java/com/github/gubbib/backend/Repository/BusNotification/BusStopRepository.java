package com.github.gubbib.backend.Repository.BusNotification;

import com.github.gubbib.backend.Domain.BusStop.BusStop;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BusStopRepository extends JpaRepository<BusStop, Long> {
}
