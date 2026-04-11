package com.github.gubbib.backend.DTO.EveryTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.*;
import lombok.Getter;

import java.util.List;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)

public class SubjectDTO {

    @JacksonXmlProperty(isAttribute = true)
    private String name;

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "timeplace")
    private List<TimePlaceDTO> timeplaces;
}