package com.github.gubbib.backend.Controller.Management;

import com.github.gubbib.backend.DTO.Error.ErrorResponseDTO;
import com.github.gubbib.backend.DTO.Post.PostCreateRequestDTO;
import com.github.gubbib.backend.DTO.Post.PostResponseDTO;
import com.github.gubbib.backend.DTO.Post.PostUpdateRequestDTO;
import com.github.gubbib.backend.Principal.CustomUserPrincipal;
import com.github.gubbib.backend.Service.Post.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/management")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "관리자", description = "관리자 전용 API")
public class ManagementController {

    private final PostService postService;

    @Operation(
            summary = "공지사항 작성",
            description = "관리자가 공지사항 게시글을 작성합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "공지사항 작성 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = PostResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "관리자 권한 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            )
    })
    @PostMapping("/notice")
    public ResponseEntity<PostResponseDTO> createNoticePost(
            @Valid @RequestBody PostCreateRequestDTO request,
            @AuthenticationPrincipal CustomUserPrincipal userPrincipal
    ){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        postService.createNoticePost(
                                request,
                                userPrincipal
                        )
                );
    }

    @Operation(
            summary = "공지사항 수정",
            description = "관리자가 공지사항 게시글을 수정합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "공지사항 수정 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = PostResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 공지사항",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "관리자 권한 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            )
    })
    @PatchMapping("/notice/{postId}")
    public ResponseEntity<PostResponseDTO> updateNoticePost(
            @Parameter(description = "공지사항 게시글 ID", example = "1")
            @PathVariable Long postId,
            @Valid @RequestBody PostUpdateRequestDTO request
    ){
        return ResponseEntity.ok(
                postService.updateNoticePost(
                        postId,
                        request
                )
        );
    }

    @Operation(
            summary = "공지사항 삭제",
            description = "관리자가 공지사항 게시글을 삭제합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "공지사항 삭제 성공"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 공지사항",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "관리자 권한 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class)
                    )
            )
    })
    @DeleteMapping("/notice/{postId}")
    public ResponseEntity<Void> deleteNoticePost(
            @Parameter(description = "공지사항 게시글 ID", example = "1")
            @PathVariable Long postId
    ){
        postService.deleteNoticePost(postId);

        return ResponseEntity.noContent().build();
    }
}