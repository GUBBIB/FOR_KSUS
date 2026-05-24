package com.github.gubbib.backend.Controller.EveryTime;

import com.github.gubbib.backend.DTO.Building.BuildingResponseDTO;
import com.github.gubbib.backend.DTO.ClassRoom.ClassRoomResponseDTO;
import com.github.gubbib.backend.DTO.ClassRoom.ClassRoomTimetableResponseDTO;
import com.github.gubbib.backend.DTO.Error.ErrorResponseDTO;
import com.github.gubbib.backend.DTO.EveryTime.FetchRequestDTO;
import com.github.gubbib.backend.Service.Building.BuildingService;
import com.github.gubbib.backend.Service.Building.BuildingServiceImp;
import com.github.gubbib.backend.Service.ClassRoom.ClassRoomService;
import com.github.gubbib.backend.Service.EveryTime.TimetableService;
import com.github.gubbib.backend.Service.EveryTime.TimetableServiceImp;
import com.github.gubbib.backend.Service.LectureTime.LectureTimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/api/v1/everytime")
@Tag(name = "EveryTime", description = "EveryTime API 호출용")
public class EveryTimeController {

    private final TimetableService timetableService;
    private final BuildingService buildingService;
    private final ClassRoomService classRoomService;
    private final LectureTimeService lectureTimeService;

    @PostMapping("/fetch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> fetch(
            @RequestBody FetchRequestDTO request
    ) throws Exception {

        timetableService.fetchAndSaveTimetable(request.cookie());

        return ResponseEntity.ok("강의실 데이터 수집 완료");
    }

    @Operation(
            summary = "건물 목록 조회",
            description = "전체 건물 목록을 조회한다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "건물 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = BuildingResponseDTO.class))
                    )
            )
    })
    @GetMapping("/buildings")
    public List<BuildingResponseDTO> getBuildings(){

        return buildingService.getAllBuildings();
    }

    @Operation(
            summary = "건물별 강의실 목록 조회",
            description = "특정 건물에 속한 강의실 목록을 조회한다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "강의실 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ClassRoomResponseDTO.class))
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 건물",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            )
    })
    @GetMapping("/buildings/{buildingID}/classrooms")
    public List<ClassRoomResponseDTO> getClassRooms(
            @PathVariable Long buildingID
    ){
        return classRoomService.getClassRoomsByBuilding(buildingID);
    }

    @Operation(
            summary = "강의실 시간표 조회",
            description = "특정 건물의 특정 강의실 시간표를 조회한다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "강의실 시간표 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ClassRoomTimetableResponseDTO.class))
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 건물",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            )
    })
    @GetMapping("/buildings/{buildingID}/classrooms/{classroomID}/timetable")
    public List<ClassRoomTimetableResponseDTO> getClassRoomTimetable(
            @PathVariable Long buildingID,
            @PathVariable Long classroomID
    ){
        return lectureTimeService.getClassRoomTimetable(buildingID, classroomID);
    }
}
