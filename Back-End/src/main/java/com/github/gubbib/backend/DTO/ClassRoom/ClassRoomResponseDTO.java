package com.github.gubbib.backend.DTO.ClassRoom;

import com.github.gubbib.backend.Domain.ClassRoom.ClassRoom;

public record ClassRoomResponseDTO(
        Long id,
        String roomNumber,
        String fullName
) {
    public static ClassRoomResponseDTO from(ClassRoom cr) {
        return new ClassRoomResponseDTO(
                cr.getId(),
                cr.getRoomNumber(),
                cr.getFullName()
        );
    }
}