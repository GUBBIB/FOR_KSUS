package com.github.gubbib.backend.Service.Board;

import com.github.gubbib.backend.DTO.Board.BoardCreateRequestDTO;
import com.github.gubbib.backend.DTO.Board.BoardResponseDTO;
import com.github.gubbib.backend.Domain.Community.Board.Board;
import com.github.gubbib.backend.Exception.ErrorCode;
import com.github.gubbib.backend.Exception.GlobalException;
import com.github.gubbib.backend.Repository.Board.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly=true)
@RequiredArgsConstructor(onConstructor_ =  @Autowired)
public class BoardServiceImp implements BoardService {

    private final BoardRepository boardRepository;

    @Override
    public Board existsBoard(Long boardId) {
        return boardRepository.findById(boardId)
                .orElseThrow(() -> new GlobalException(ErrorCode.BOARD_NOT_FOUND));
    }

    @Override
    public List<BoardResponseDTO> getBoards() {

        return boardRepository.findAll()
                .stream()
                .map(BoardResponseDTO::from)
                .toList();
    }

    @Override
    @Transactional
    public BoardResponseDTO createBoard(BoardCreateRequestDTO request) {

        if (boardRepository.existsByTitle(request.title())) {
            throw new GlobalException(ErrorCode.BOARD_NAME_DUPLICATION);
        }

        Board board = new Board(
                request.title(),
                request.description()
        );

        Board savedBoard = boardRepository.save(board);

        return BoardResponseDTO.from(savedBoard);
    }
}
