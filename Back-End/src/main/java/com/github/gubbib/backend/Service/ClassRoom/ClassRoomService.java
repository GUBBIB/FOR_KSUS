package com.github.gubbib.backend.Service.ClassRoom;

import com.github.gubbib.backend.DTO.ClassRoom.ClassRoomResponseDTO;

import java.util.List;

public interface ClassRoomService {
    List<ClassRoomResponseDTO> getClassRoomsByBuilding(Long buildingId);
}
