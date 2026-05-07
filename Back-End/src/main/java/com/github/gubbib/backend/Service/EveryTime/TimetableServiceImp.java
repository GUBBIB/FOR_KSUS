package com.github.gubbib.backend.Service.EveryTime;

import com.github.gubbib.backend.DTO.EveryTime.ResponseDTO;
import com.github.gubbib.backend.DTO.EveryTime.SubjectDTO;
import com.github.gubbib.backend.DTO.EveryTime.TimePlaceDTO;
import com.github.gubbib.backend.Service.EveryTime.EverytimeClient;
import com.github.gubbib.backend.Service.EveryTime.TimetableParser;
import com.github.gubbib.backend.Service.EveryTime.TimetableSaver;
import com.github.gubbib.backend.Service.EveryTime.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TimetableServiceImp implements TimetableService {

    private final EverytimeClient everytimeClient;
    private final TimetableParser timetableParser;
    private final TimetableSaver timetableSaver;

    @Override
    public void fetchAndSaveTimetable(String cookie) throws Exception {

        int startNum = 0;
        int limitNum = 50;

        while (true) {

            String xml = everytimeClient.fetchTimetable(cookie, startNum, limitNum);

            ResponseDTO response = timetableParser.parse(xml);
            List<SubjectDTO> subjects = response.getSubjects();

            if (subjects == null || subjects.isEmpty()) break;

            for (SubjectDTO subject : subjects) {
                if (subject.getTimeplaces() == null) continue;

                for (TimePlaceDTO tp : subject.getTimeplaces()) {
                    timetableSaver.save(tp);
                }
            }

            startNum += limitNum;
            Thread.sleep(200);
        }
    }
}