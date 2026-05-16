package com.github.gubbib.backend.Domain.Lecture;

import com.github.gubbib.backend.Domain.LectureTime.LectureTime;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "lectures")
public class Lecture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject_code", nullable = false)
    private String subjectCode;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Column(name = "professor", nullable = false)
    private String professor;

    @Column(name = "lecture_id", nullable = false)
    private String lectureId;

    @OneToMany(mappedBy = "lecture")
    private List<LectureTime> lectureTimes = new ArrayList<>();

    public static Lecture create(
            String subjectCode,
            String subjectName,
            String professor,
            String lectureId
    ) {
        Lecture l = new Lecture();
        l.subjectCode = subjectCode;
        l.subjectName = subjectName;
        l.professor = professor;
        l.lectureId = lectureId;
        return l;
    }


}
