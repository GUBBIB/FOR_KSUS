package com.github.gubbib.backend.DTO.Board;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BoardCreateRequestDTO(

        @NotBlank
        @Size(max = 255)
        String title,

        @Size(max = 255)
        String description
) {
}
