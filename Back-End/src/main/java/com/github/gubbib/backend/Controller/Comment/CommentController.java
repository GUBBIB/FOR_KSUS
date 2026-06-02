package com.github.gubbib.backend.Controller.Comment;


import com.github.gubbib.backend.DTO.Comment.CommentCreateRequestDTO;
import com.github.gubbib.backend.DTO.Comment.CommentResponseDTO;
import com.github.gubbib.backend.DTO.Comment.CommentUpdateRequestDTO;
import com.github.gubbib.backend.Principal.CustomUserPrincipal;
import com.github.gubbib.backend.Service.Comment.CommentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/api/v1/boards/{boardId}/posts/{postId}/comments")
@Tag(name = "댓글", description = "댓글 API")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/")
    public ResponseEntity<List<CommentResponseDTO>> getAllComment(
            @PathVariable Long boardId,
            @PathVariable Long postId
    ){

        return ResponseEntity.ok(
                commentService.getAllComments(boardId, postId)
        );
    }

    @PostMapping("/")
    public ResponseEntity<CommentResponseDTO> createComment(
            @PathVariable Long boardId,
            @PathVariable Long postId,
            @Valid @RequestBody CommentCreateRequestDTO request,
            @AuthenticationPrincipal CustomUserPrincipal userPrincipal
    ){

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        commentService.createComment(
                                boardId,
                                postId,
                                request,
                                userPrincipal
                        )
                );
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponseDTO> updateComment(
            @PathVariable Long boardId,
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @Valid @RequestBody CommentUpdateRequestDTO request,
            @AuthenticationPrincipal CustomUserPrincipal userPrincipal
    ){

        return ResponseEntity.ok(
                commentService.updateComment(boardId, postId, commentId, request, userPrincipal)
        );
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long boardId,
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserPrincipal userPrincipal
    ){

        commentService.deleteComment(boardId, postId, commentId, userPrincipal);

        return ResponseEntity.noContent().build();
    }
}
