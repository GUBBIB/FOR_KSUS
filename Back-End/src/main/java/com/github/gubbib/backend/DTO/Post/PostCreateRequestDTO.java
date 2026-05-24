package com.github.gubbib.backend.DTO.Post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostCreateRequestDTO(

        @NotBlank
        @Size(max = 255)
        String title,

        @NotBlank
        String content
) {
}
