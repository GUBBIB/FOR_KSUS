package com.github.gubbib.backend.DTO.EveryTime;

import com.fasterxml.jackson.dataformat.xml.annotation.*;
import lombok.Getter;

import java.util.List;

@Getter
@JacksonXmlRootElement(localName = "response")
public class ResponseDTO {

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "subject")
    private List<SubjectDTO> subjects;
}