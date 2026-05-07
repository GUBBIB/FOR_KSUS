package com.github.gubbib.backend.Controller.EveryTime;

<<<<<<< HEAD
import com.github.gubbib.backend.DTO.EveryTime.FetchRequestDTO;
import com.github.gubbib.backend.Service.EveryTime.TimetableService;
=======
import com.github.gubbib.backend.DTO.Building.BuildingResponseDTO;
import com.github.gubbib.backend.DTO.ClassRoom.ClassRoomResponseDTO;
import com.github.gubbib.backend.DTO.EveryTime.FetchRequestDTO;
import com.github.gubbib.backend.Service.Building.BuildingService;
import com.github.gubbib.backend.Service.Building.BuildingServiceImp;
import com.github.gubbib.backend.Service.ClassRoom.ClassRoomService;
import com.github.gubbib.backend.Service.EveryTime.TimetableService;
import com.github.gubbib.backend.Service.EveryTime.TimetableServiceImp;
>>>>>>> 88b5bad72e1c0f388318a65c9fba0e3372bff26f
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
<<<<<<< HEAD
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
=======
import org.springframework.web.bind.annotation.*;

import java.util.List;
>>>>>>> 88b5bad72e1c0f388318a65c9fba0e3372bff26f

@RestController
@RequiredArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/api/v1/everytime")
@Tag(name = "EveryTime", description = "EveryTime API 호출용")
public class EveryTimeController {

    private final TimetableService timetableService;
<<<<<<< HEAD
=======
    private final BuildingService buildingService;
    private final ClassRoomService classRoomService;
>>>>>>> 88b5bad72e1c0f388318a65c9fba0e3372bff26f

    @PostMapping("/fetch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> fetch(
            @RequestBody FetchRequestDTO request
    ) throws Exception {

<<<<<<< HEAD
        timetableService.fetchAndSaveClassrooms(request.cookie());

        return ResponseEntity.ok("강의실 데이터 수집 완료");
    }
=======
        timetableService.fetchAndSaveTimetable(request.cookie());

        return ResponseEntity.ok("강의실 데이터 수집 완료");
    }

    @GetMapping("/buildings")
    public List<BuildingResponseDTO> getBuildings(){

        return buildingService.getAllBuildings();
    }

    @GetMapping("/buildings/{buildingID}/classrooms")
    public List<ClassRoomResponseDTO> getClassRooms(
            @PathVariable Long buildingID
    ){
        return classRoomService.getClassRoomsByBuilding(buildingID);
    }
>>>>>>> 88b5bad72e1c0f388318a65c9fba0e3372bff26f
}
