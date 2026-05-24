package com.github.gubbib.backend.Controller.Board;

import com.github.gubbib.backend.DTO.Board.BoardCreateRequestDTO;
import com.github.gubbib.backend.DTO.Board.BoardResponseDTO;
import com.github.gubbib.backend.Repository.Board.BoardRepository;
import com.github.gubbib.backend.Service.Board.BoardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/api/v1/boards")
@Tag(name = "게시판", description = "게시판 API")
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/")
    public ResponseEntity<List<BoardResponseDTO>> getBoard(){

        return ResponseEntity.ok(
                boardService.getBoards()
        );
    }

    @PostMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BoardResponseDTO> createBoard(
            @Valid @RequestBody BoardCreateRequestDTO request
    ){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(boardService.createBoard(request));
    }

}
