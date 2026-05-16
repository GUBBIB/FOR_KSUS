package com.github.gubbib.backend.Repository.Lecture;

import com.github.gubbib.backend.Domain.Lecture.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LectureRepository extends JpaRepository<Lecture, Long> {
    Optional<Lecture> findByLectureId(String lectureId);
}
