package com.github.gubbib.backend.Service.LectureTime;

import com.github.gubbib.backend.DTO.ClassRoom.ClassRoomTimetableResponseDTO;
import com.github.gubbib.backend.Domain.TimeTable.Building.Building;
import com.github.gubbib.backend.Domain.TimeTable.LectureTime.LectureTime;
import com.github.gubbib.backend.Repository.LectureTime.LectureTimeRepository;
import com.github.gubbib.backend.Service.Building.BuildingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional(readOnly=true)
@RequiredArgsConstructor(onConstructor_ =  @Autowired)
public class LectureTimeServiceImp implements LectureTimeService {

    private final LectureTimeRepository lectureTimeRepository;
    private final BuildingService buildingService;

    @Override
    public List<ClassRoomTimetableResponseDTO> getClassRoomTimetable(Long buildingId, Long classroomId) {

        //예외
        Building b = buildingService.existsBuilding(buildingId);

        return lectureTimeRepository.findByClassRoomId(classroomId)
                .stream()
                .sorted(
                        Comparator.comparing(LectureTime::getDay)
                                .thenComparing(LectureTime::getStart)
                )
                .map(ClassRoomTimetableResponseDTO::from)
                .toList();
    }
}
