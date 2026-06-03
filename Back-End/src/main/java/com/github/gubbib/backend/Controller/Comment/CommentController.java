package com.github.gubbib.backend.Controller.Comment;


import com.github.gubbib.backend.DTO.Comment.CommentCreateRequestDTO;
import com.github.gubbib.backend.DTO.Comment.CommentResponseDTO;
import com.github.gubbib.backend.DTO.Comment.CommentUpdateRequestDTO;
import com.github.gubbib.backend.DTO.Error.ErrorResponseDTO;
import com.github.gubbib.backend.Principal.CustomUserPrincipal;
import com.github.gubbib.backend.Service.Comment.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(
            summary = "댓글 목록 조회",
            description = "특정 게시글의 전체 댓글을 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "댓글 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CommentResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 게시글",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            )
    })
    @GetMapping("/")
    public ResponseEntity<List<CommentResponseDTO>> getAllComment(
            @PathVariable Long boardId,
            @PathVariable Long postId
    ){

        return ResponseEntity.ok(
                commentService.getAllComments(boardId, postId)
        );
    }

    @Operation(
            summary = "댓글 작성",
            description = "특정 게시글에 댓글을 작성합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "댓글 작성 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CommentResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 게시글",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증 실패",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            )
    })
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

    @Operation(
            summary = "댓글 수정",
            description = "작성한 댓글을 수정합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "댓글 수정 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CommentResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "변경된 내용이 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "댓글 수정 권한 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 댓글",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            )
    })
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

    @Operation(
            summary = "댓글 삭제",
            description = "작성한 댓글을 삭제합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "댓글 삭제 성공"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "댓글 삭제 권한 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 댓글",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            )
    })
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
