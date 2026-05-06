package com.github.gubbib.backend.Service.EveryTime;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.github.gubbib.backend.DTO.EveryTime.ResponseDTO;
import com.github.gubbib.backend.Service.EveryTime.TimetableParser;
import org.springframework.stereotype.Service;

@Service
public class TimetableParserImp implements TimetableParser {

    private final XmlMapper xmlMapper = new XmlMapper();

    @Override
    public ResponseDTO parse(String xml) throws Exception {
        return xmlMapper.readValue(xml, ResponseDTO.class);
    }
}