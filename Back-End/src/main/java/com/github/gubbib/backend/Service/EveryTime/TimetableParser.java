package com.github.gubbib.backend.Service.EveryTime;

import com.github.gubbib.backend.DTO.EveryTime.ResponseDTO;

public interface TimetableParser {
    ResponseDTO parse(String xml) throws Exception;
}
