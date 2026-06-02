package com.github.gubbib.backend.DTO.Comment;

import jakarta.validation.constraints.NotBlank;

public record CommentUpdateRequestDTO(
        @NotBlank
        String content
) {
}
