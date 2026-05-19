package com.github.gubbib.backend.DTO.ClassRoom;

import com.github.gubbib.backend.Domain.LectureTime.LectureTime;

public record ClassRoomTimetableResponseDTO(
        String lectureName,
        String professor,
        int dayOfWeek,
        int startTime,
        int endTime
) {
    public static ClassRoomTimetableResponseDTO from(LectureTime lt) {
        return new ClassRoomTimetableResponseDTO(
                lt.getLecture().getSubjectName(),
                lt.getLecture().getProfessor(),
                lt.getDay(),
                lt.getStart(),
                lt.getEnd()
        );
    }
}
