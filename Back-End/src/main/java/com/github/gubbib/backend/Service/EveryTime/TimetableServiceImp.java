package com.github.gubbib.backend.Service.EveryTime;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.github.gubbib.backend.DTO.EveryTime.*;
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

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TimetableService {

    private final WebClient webClient;
    private final BuildingRepository buildingRepository;
    private final ClassRoomRepository classRoomRepository;

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

            if (subjects == null || subjects.isEmpty()) break;

            for (SubjectDTO subject : subjects) {

                if (subject.getTimeplaces() == null) continue;

                for (TimePlaceDTO tp : subject.getTimeplaces()) {

                    parseAndSavePlace(tp.getPlace());
                }
            }

            startNum += limitNum;
            System.out.println("현재 startNum: " + startNum);

            Thread.sleep(200);
        }
    }

    /**
     * place 문자열 파싱 + 저장
     */
    private void parseAndSavePlace(String place) {

        if (place == null || place.isBlank()) return;

        // 디버깅 로그
        System.out.println("원본 place = [" + place + "]");

        // 공백 정리
        String cleaned = place.trim();

        // 공백 기준 분리 (여러 공백 대응)
        String[] parts = cleaned.split("\\s+");

        if (parts.length < 2) {
            System.out.println("❌ 파싱 실패 (형식 이상): " + place);
            return;
        }

        String buildingName = cleanBuildingName(parts[0]);
        String roomNumber = cleanRoomNumber(parts[1]);

        if (buildingName.isEmpty() || roomNumber.isEmpty()) {
            System.out.println("❌ 정제 실패: " + place);
            return;
        }

        getOrCreateClassroom(buildingName, roomNumber);
    }

    /**
     * 건물명 정리
     */
    private String cleanBuildingName(String raw) {
        return raw.trim();
    }

    /**
     * 강의실 번호 정리
     * 예: 615. → 615
     * 예: 425-1 → 그대로 유지
     */
    private String cleanRoomNumber(String raw) {
        return raw
                .trim()
                .replaceAll("[^0-9\\-]", ""); // 숫자 + - 만 허용
    }

    /**
     * DB 저장 (중복 방지)
     */
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