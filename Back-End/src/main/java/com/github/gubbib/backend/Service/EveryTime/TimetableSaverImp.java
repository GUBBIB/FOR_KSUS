package com.github.gubbib.backend.Service.EveryTime;

import com.github.gubbib.backend.DTO.EveryTime.TimePlaceDTO;
import com.github.gubbib.backend.Domain.Building.Building;
import com.github.gubbib.backend.Domain.ClassRoom.ClassRoom;
import com.github.gubbib.backend.Domain.LectureTime.LectureTime;
import com.github.gubbib.backend.Repository.Building.BuildingRepository;
import com.github.gubbib.backend.Repository.ClassRoom.ClassRoomRepository;
import com.github.gubbib.backend.Repository.LectureTime.LectureTimeRepository;
import com.github.gubbib.backend.Service.EveryTime.TimetableSaver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TimetableSaverImp implements TimetableSaver {

    private final BuildingRepository buildingRepository;
    private final ClassRoomRepository classRoomRepository;
    private final LectureTimeRepository lectureTimeRepository;

    @Override
    @Transactional
    public void save(TimePlaceDTO tp) {

        String place = tp.getPlace();
        if (place == null || place.isBlank()) return;

        String[] parts = place.trim().split("\\s+");
        if (parts.length < 2) return;

        String buildingName = parts[0].trim();
        String roomNumber = parts[1].replaceAll("[^0-9\\-]", "");

        if (buildingName.isEmpty() || roomNumber.isEmpty()) return;

        ClassRoom classroom = getOrCreateClassroom(buildingName, roomNumber);

        saveLectureTime(tp, classroom);
    }

    private ClassRoom getOrCreateClassroom(String buildingName, String roomNumber) {

        Building building = buildingRepository.findByName(buildingName)
                .orElseGet(() -> buildingRepository.save(
                        Building.create(buildingName, buildingName)
                ));

        return classRoomRepository.findByBuildingAndRoomNumber(building, roomNumber)
                .orElseGet(() -> classRoomRepository.save(
                        ClassRoom.create(building, roomNumber)
                ));
    }

    private void saveLectureTime(TimePlaceDTO tp, ClassRoom classroom) {

        if (lectureTimeRepository.existsByClassRoomAndDayAndStartAndEnd(
                classroom, tp.getDay(), tp.getStart(), tp.getEnd()
        )) return;

        LectureTime lectureTime = LectureTime.create(
                classroom,
                tp.getDay(),
                tp.getStart(),
                tp.getEnd()
        );

        lectureTimeRepository.save(lectureTime);
    }
}