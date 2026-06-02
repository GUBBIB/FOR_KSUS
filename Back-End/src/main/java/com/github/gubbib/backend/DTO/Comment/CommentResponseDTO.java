package com.github.gubbib.backend.DTO.Comment;

import com.github.gubbib.backend.Domain.Comment.Comment;

import java.time.LocalDateTime;

public record CommentResponseDTO(
        Long id,
        String content,
        String writer,
        LocalDateTime createdAt
) {
    public static CommentResponseDTO from(Comment comment) {
        return new CommentResponseDTO(
                comment.getId(),
                comment.getContent(),
                comment.getUser().getNickname(),
                comment.getCreatedAt()
        );
    }
}
