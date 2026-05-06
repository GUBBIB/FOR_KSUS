package com.github.gubbib.backend.Service.ClassRoom;

import com.github.gubbib.backend.DTO.ClassRoom.ClassRoomResponseDTO;
import com.github.gubbib.backend.Domain.Building.Building;
import com.github.gubbib.backend.Domain.ClassRoom.ClassRoom;
import com.github.gubbib.backend.Exception.ErrorCode;
import com.github.gubbib.backend.Exception.GlobalException;
import com.github.gubbib.backend.Repository.Building.BuildingRepository;
import com.github.gubbib.backend.Repository.ClassRoom.ClassRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;


@Service
@Transactional(readOnly=true)
@RequiredArgsConstructor(onConstructor_ =  @Autowired)
public class ClassRoomServiceImp implements ClassRoomService {

    private final ClassRoomRepository classRoomRepository;
    private final BuildingRepository buildingRepository;

    @Override
    public List<ClassRoomResponseDTO> getClassRoomsByBuilding(Long buildingId) {

        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new GlobalException(ErrorCode.BUILDING_NOT_FOUND));

        return classRoomRepository.findByBuilding(building)
                .stream()
                .sorted(Comparator.comparing(ClassRoom::getRoomNumber))
                .map(ClassRoomResponseDTO::from)
                .toList();
    }
}
