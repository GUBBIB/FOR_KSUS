package com.github.gubbib.backend.Domain.ClassRoom;

import com.github.gubbib.backend.Domain.BaseEntity;
import com.github.gubbib.backend.Domain.Building.Building;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "classrooms")
public class ClassRoom extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "room_number", nullable = false)
    private String roomNumber; // 524

    @Column(name = "full_name")
    private String fullName; // 6관 524

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id")
    private Building building;

    public static ClassRoom create(Building building, String roomNumber) {
        ClassRoom cr = new ClassRoom();
        cr.building = building;
        cr.roomNumber = roomNumber;
        cr.fullName = building.getName() + " " + roomNumber;
        return cr;
    }
}