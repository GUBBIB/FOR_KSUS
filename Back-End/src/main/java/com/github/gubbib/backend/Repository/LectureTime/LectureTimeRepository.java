package com.github.gubbib.backend.Repository.LectureTime;

import com.github.gubbib.backend.Domain.TimeTable.ClassRoom.ClassRoom;
import com.github.gubbib.backend.Domain.TimeTable.LectureTime.LectureTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LectureTimeRepository extends JpaRepository<LectureTime, Long> {

    boolean existsByClassRoomAndDayAndStartAndEnd(ClassRoom classRoom, int day, int start, int end);
    List<LectureTime> findByClassRoomId(Long classroomId);
}