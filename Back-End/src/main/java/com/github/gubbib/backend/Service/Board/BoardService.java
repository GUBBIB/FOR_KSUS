package com.github.gubbib.backend.Service.Board;

import com.github.gubbib.backend.DTO.Board.BoardCreateRequestDTO;
import com.github.gubbib.backend.DTO.Board.BoardResponseDTO;
import com.github.gubbib.backend.Domain.Community.Board.Board;

import java.util.List;

public interface BoardService {
    Board existsBoard(Long boardId);
    List<BoardResponseDTO> getBoards();
    BoardResponseDTO createBoard(BoardCreateRequestDTO request);
}
