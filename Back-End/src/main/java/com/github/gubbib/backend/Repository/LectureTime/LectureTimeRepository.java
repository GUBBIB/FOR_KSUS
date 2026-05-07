package com.github.gubbib.backend.Repository.LectureTime;

import com.github.gubbib.backend.Domain.ClassRoom.ClassRoom;
import com.github.gubbib.backend.Domain.LectureTime.LectureTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LectureTimeRepository extends JpaRepository<LectureTime, Long> {

    boolean existsByClassRoomAndDayAndStartAndEnd(ClassRoom classRoom, int day, int start, int end);
}