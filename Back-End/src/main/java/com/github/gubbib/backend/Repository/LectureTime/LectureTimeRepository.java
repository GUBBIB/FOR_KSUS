package com.github.gubbib.backend.Repository.LectureTime;

<<<<<<< HEAD
=======
import com.github.gubbib.backend.Domain.ClassRoom.ClassRoom;
>>>>>>> 88b5bad72e1c0f388318a65c9fba0e3372bff26f
import com.github.gubbib.backend.Domain.LectureTime.LectureTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LectureTimeRepository extends JpaRepository<LectureTime, Long> {
<<<<<<< HEAD
=======

    boolean existsByClassRoomAndDayAndStartAndEnd(ClassRoom classRoom, int day, int start, int end);
>>>>>>> 88b5bad72e1c0f388318a65c9fba0e3372bff26f
}