package com.github.gubbib.backend.Service.EveryTime;

import com.github.gubbib.backend.DTO.EveryTime.SubjectDTO;
import com.github.gubbib.backend.DTO.EveryTime.TimePlaceDTO;

public interface TimetableSaver {
    void save(SubjectDTO subject, TimePlaceDTO tp);
}
