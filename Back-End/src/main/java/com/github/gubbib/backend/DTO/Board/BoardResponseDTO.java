package com.github.gubbib.backend.DTO.Board;

import com.github.gubbib.backend.Domain.Board.Board;
import lombok.Builder;

@Builder
public record BoardResponseDTO(
        Long id,
        String title,
        String description
) {
    public static BoardResponseDTO from(Board board) {

        return BoardResponseDTO.builder()
                .id(board.getId())
                .title(board.getTitle())
                .description(board.getDescription())
                .build();
    }
}
