package com.github.gubbib.backend.Repository.ClassRoom;

import com.github.gubbib.backend.Domain.Building.Building;
import com.github.gubbib.backend.Domain.ClassRoom.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;

<<<<<<< HEAD
=======
import java.util.List;
>>>>>>> 88b5bad72e1c0f388318a65c9fba0e3372bff26f
import java.util.Optional;

public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {
    boolean existsByBuildingAndRoomNumber(Building building, String roomNumber);
    Optional<ClassRoom> findByBuildingAndRoomNumber(Building building, String roomNumber);
<<<<<<< HEAD
=======
    List<ClassRoom> findByBuilding(Building building);
>>>>>>> 88b5bad72e1c0f388318a65c9fba0e3372bff26f
}