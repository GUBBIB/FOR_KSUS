package com.github.gubbib.backend.Config;

import com.github.gubbib.backend.Service.EveryTime.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class TimetableScheduler {
    private final TimetableService timetableService;

    // 3월 1~7일
    @Scheduled(cron = "0 0 3 1-7 3 *")
    public void firstSemesterWeek() throws Exception {
        timetableService.fetchAndSaveClassrooms();
    }

    // 9월 1~7일
    @Scheduled(cron = "0 0 3 1-7 9 *")
    public void secondSemesterWeek() throws Exception {
        timetableService.fetchAndSaveClassrooms();
    }
}
