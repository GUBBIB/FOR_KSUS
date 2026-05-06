package com.github.gubbib.backend.Service.EveryTime;

import com.github.gubbib.backend.Service.EveryTime.EverytimeClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class EverytimeClientImp implements EverytimeClient {

    private final WebClient webClient;

    @Override
    public String fetchTimetable(String cookie, int startNum, int limitNum) {
        return webClient.post()
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
    }
}