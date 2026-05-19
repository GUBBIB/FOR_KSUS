package com.github.gubbib.backend.Service.LectureTime;

import com.github.gubbib.backend.DTO.ClassRoom.ClassRoomTimetableResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

public interface LectureTimeService {
    List<ClassRoomTimetableResponseDTO> getClassRoomTimetable(Long buildingId, Long classroomId);
}
