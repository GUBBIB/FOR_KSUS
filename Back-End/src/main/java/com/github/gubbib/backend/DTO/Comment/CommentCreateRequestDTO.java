package com.github.gubbib.backend.DTO.Comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentCreateRequestDTO(

        @NotBlank
        String content
) {
}
