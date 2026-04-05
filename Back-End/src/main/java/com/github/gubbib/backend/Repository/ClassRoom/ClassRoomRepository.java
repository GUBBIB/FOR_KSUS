package com.github.gubbib.backend.Repository.ClassRoom;

import com.github.gubbib.backend.Domain.Building.Building;
import com.github.gubbib.backend.Domain.ClassRoom.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {
    boolean existsByBuildingAndRoomNumber(Building building, String roomNumber);
}