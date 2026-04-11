package com.github.gubbib.backend.Service.EveryTime;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.github.gubbib.backend.DTO.EveryTime.FetchRequestDTO;
import com.github.gubbib.backend.DTO.EveryTime.ResponseDTO;
import com.github.gubbib.backend.DTO.EveryTime.SubjectDTO;
import com.github.gubbib.backend.DTO.EveryTime.TimePlaceDTO;
import com.github.gubbib.backend.Domain.Building.Building;
import com.github.gubbib.backend.Domain.ClassRoom.ClassRoom;
import com.github.gubbib.backend.Repository.Building.BuildingRepository;
import com.github.gubbib.backend.Repository.ClassRoom.ClassRoomRepository;
import com.github.gubbib.backend.Repository.LectureTime.LectureTimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TimetableService {

    private final WebClient webClient;
    private final BuildingRepository buildingRepository;
    private final ClassRoomRepository classRoomRepository;
    private final LectureTimeRepository lectureTimeRepository;

    private final XmlMapper xmlMapper = new XmlMapper();

    @Transactional
    public void fetchAndSaveClassrooms(String cookie) throws Exception {

        int startNum = 0;
        int limitNum = 50;

        while (true) {

            String xml = webClient.post()
                    .uri("/find/timetable/subject/list")
                    .header("User-Agent", "Mozilla/5.0")
                    .header("Referer", "https://everytime.kr/")
                    .header("Cookie", cookie)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData("campusId", "178")
                            .with("year", "2026")
                            .with("semester", "1")
                            .with("limitNum", String.valueOf(limitNum))
                            .with("startNum", String.valueOf(startNum)))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            ResponseDTO response = xmlMapper.readValue(xml, ResponseDTO.class);

            List<SubjectDTO> subjects = response.getSubjects();

            // 종료 조건
            if (subjects == null || subjects.isEmpty()) {
                break;
            }

            for (SubjectDTO subject : subjects) {

                if (subject.getTimeplaces() == null) continue;

                for (TimePlaceDTO tp : subject.getTimeplaces()) {

                    String place = tp.getPlace();

                    if (place == null || place.isBlank()) continue;

                    String[] parts = place.split(" ");
                    if (parts.length < 2) continue;

                    String buildingName = parts[0]; // ex) 6관
                    String roomNumber = parts[1];   // ex) 524

                    getOrCreateClassroom(buildingName, roomNumber);
                }
            }

            startNum += limitNum;

            System.out.println("현재 startNum: " + startNum);

            // 너무 빠른 요청 방지
            Thread.sleep(200);
        }
    }

    private ClassRoom getOrCreateClassroom(String buildingName, String roomNumber) {

        Building building = buildingRepository.findByName(buildingName)
                .orElseGet(() -> buildingRepository.save(
                        Building.create(buildingName, buildingName)
                ));

        return classRoomRepository.findByBuildingAndRoomNumber(building, roomNumber)
                .orElseGet(() -> {
                    ClassRoom c = ClassRoom.create(building, roomNumber);
                    return classRoomRepository.save(c);
                });
    }
}