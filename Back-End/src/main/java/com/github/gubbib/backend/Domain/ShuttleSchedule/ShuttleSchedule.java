package com.github.gubbib.backend.Domain.ShuttleSchedule;

import com.github.gubbib.backend.Domain.BaseEntity;
import com.github.gubbib.backend.Domain.BusStop.BusStop;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;


@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "ShuttleSchedule")
public class ShuttleSchedule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "departure_time")
    private LocalTime departureTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "busstop_id", nullable = false)
    private BusStop busStop;


    public ShuttleSchedule(
            LocalTime departureTime,
            BusStop busStop
    ) {
        this.departureTime = departureTime;
        this.busStop = busStop;
    }
}
