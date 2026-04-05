package com.github.gubbib.backend.Domain.Building;


import com.github.gubbib.backend.Domain.BaseEntity;
import com.github.gubbib.backend.Domain.ClassRoom.ClassRoom;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "buildings")
public class Building extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "full_name")
    private String fullName;

    @OneToMany(mappedBy = "building")
    private List<ClassRoom> classrooms = new ArrayList<>();

    public static Building create(String name, String fullName) {
        Building building = new Building();
        building.name = name;
        building.fullName = fullName;
        return building;
    }
}
