package com.github.gubbib.backend.Controller.EveryTime;

import com.github.gubbib.backend.Service.EveryTime.TimetableService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/api/v1/everytime")
@Tag(name = "EveryTime", description = "EveryTime API 호출용")
public class EveryTimeController {

    private final TimetableService timetableService;

    @PostMapping("/fetch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> fetch() throws Exception {

        timetableService.fetchAndSaveClassrooms();

        return ResponseEntity.ok("강의실 데이터 수집 완료");
    }
}
