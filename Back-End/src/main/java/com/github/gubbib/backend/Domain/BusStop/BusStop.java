package com.github.gubbib.backend.Domain.BusStop;

import com.github.gubbib.backend.Domain.BaseEntity;
import com.github.gubbib.backend.Domain.ShuttleSchedule.ShuttleSchedule;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "BusStop")
public class BusStop extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "busStop")
    private List<ShuttleSchedule> shuttleSchedules = new ArrayList<>();

    public BusStop(String name) {
        this.name = name;
    }
}