package com.github.gubbib.backend.DTO.EveryTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class TimePlaceDTO {

    @JacksonXmlProperty(isAttribute = true)
    private int day;

    @JacksonXmlProperty(isAttribute = true)
    private int start;

    @JacksonXmlProperty(isAttribute = true)
    private int end;

    @JacksonXmlProperty(isAttribute = true)
    private String place; // "6관 524"
}