package com.github.gubbib.backend.Service.EveryTime;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.github.gubbib.backend.DTO.EveryTime.ResponseDTO;
import com.github.gubbib.backend.DTO.EveryTime.SubjectDTO;
import com.github.gubbib.backend.DTO.EveryTime.TimePlaceDTO;
import com.github.gubbib.backend.Domain.Building.Building;
import com.github.gubbib.backend.Domain.ClassRoom.ClassRoom;
import com.github.gubbib.backend.Repository.Building.BuildingRepository;
import com.github.gubbib.backend.Repository.ClassRoom.ClassRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TimetableService {

    private final WebClient webClient;
    private final BuildingRepository buildingRepository;
    private final ClassRoomRepository classRoomRepository;

    private final XmlMapper xmlMapper = new XmlMapper();

    public void fetchAndSaveClassrooms() throws Exception {

        //  API 호출
        String xml = webClient.post()
                .uri("/find/timetable/subject/list")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("campusId", "178")
                        .with("year", "2026")
                        .with("semester", "1")
                        .with("limitNum", "50")
                        .with("startNum", "0"))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        //  XML → DTO 변환
        ResponseDTO response = xmlMapper.readValue(xml, ResponseDTO.class);

        //  강의실 추출 + 저장
        for (SubjectDTO subject : response.getSubjects()) {

            if (subject.getTimeplaces() == null) continue;

            for (TimePlaceDTO tp : subject.getTimeplaces()) {

                String place = tp.getPlace();

                if (place == null || place.isBlank()) continue;

                // "6관 524" 분리
                String[] parts = place.split(" ");
                if (parts.length < 2) continue;

                String buildingName = parts[0]; // 6관
                String roomNumber = parts[1];   // 524

                saveClassroom(buildingName, roomNumber);
            }
        }
    }

    private void saveClassroom(String buildingName, String roomNumber) {

        //  건물 찾거나 생성
        Building building = buildingRepository.findByName(buildingName)
                .orElseGet(() -> buildingRepository.save(
                        Building.create(buildingName, buildingName)
                ));

        //  강의실 중복 체크
        boolean exists = classRoomRepository
                .existsByBuildingAndRoomNumber(building, roomNumber);

        //  없으면 저장
        if (!exists) {
            ClassRoom classRoom = ClassRoom.create(building, roomNumber);
            classRoomRepository.save(classRoom);
        }
    }
}