package com.github.gubbib.backend.Domain.LectureTime;

import com.github.gubbib.backend.Domain.BaseEntity;
import com.github.gubbib.backend.Domain.ClassRoom.ClassRoom;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "lecture_times")
public class LectureTime extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int day;    // 0=월, 1=화, ...
    private int start;  // 120
    private int end;    // 144

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id")
    private ClassRoom classRoom;

    public static LectureTime create(ClassRoom classRoom, int day, int start, int end) {
        LectureTime lt = new LectureTime();
        lt.classRoom = classRoom;
        lt.day = day;
        lt.start = start;
        lt.end = end;
        return lt;
    }
}