package com.github.gubbib.backend.Controller.Post;


import com.github.gubbib.backend.DTO.Post.PostCreateRequestDTO;
import com.github.gubbib.backend.DTO.Post.PostResponseDTO;
import com.github.gubbib.backend.DTO.Post.PostUpdateRequestDTO;
import com.github.gubbib.backend.Principal.CustomUserPrincipal;
import com.github.gubbib.backend.Service.Post.PostService;
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
@RequestMapping("/api/v1/boards/{boardId}/posts")
@Tag(name = "게시글", description = "게시글 API")
public class PostController {

    private final PostService postService;

    @PostMapping("/")
    public ResponseEntity<PostResponseDTO> createPost(
            @PathVariable Long boardId,
            @Valid @RequestBody PostCreateRequestDTO request,
            @AuthenticationPrincipal CustomUserPrincipal userPrincipal
    ){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        postService.createPost(
                                boardId,
                                request,
                                userPrincipal
                        )
                );
    }

    @GetMapping("/")
    public ResponseEntity<List<PostResponseDTO>> getAllPosts(
            @PathVariable Long boardId
    ){
        return ResponseEntity.ok(
                postService.getAllPosts(boardId)
        );
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDTO> getPost(
            @PathVariable Long boardId,
            @PathVariable Long postId
    ){
        return ResponseEntity.ok(
                postService.getPost(boardId, postId)
        );
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostResponseDTO> updatePost(
            @PathVariable Long boardId,
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserPrincipal userPrincipal,
            @Valid @RequestBody PostUpdateRequestDTO request
    ){
        return ResponseEntity.ok(
                postService.updatePost(boardId, postId, request, userPrincipal)
        );
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long boardId,
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserPrincipal userPrincipal
    ){

        postService.deletePost(boardId, postId, userPrincipal);

        return ResponseEntity.noContent().build();
    }
}
