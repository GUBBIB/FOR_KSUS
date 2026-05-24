package com.github.gubbib.backend.DTO.Post;

import com.github.gubbib.backend.Domain.Post.Post;

import java.time.LocalDateTime;

public record PostResponseDTO(
        Long id,
        String title,
        String content,
        String writer,
        Integer viewCount,
        LocalDateTime createdAt
) {

    public static PostResponseDTO from(Post post) {

        return new PostResponseDTO(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getUser().getNickname(),
                post.getViewCount(),
                post.getCreatedAt()
        );
    }
}
