package com.github.gubbib.backend.Service.Comment;

import com.github.gubbib.backend.DTO.Comment.CommentCreateRequestDTO;
import com.github.gubbib.backend.DTO.Comment.CommentResponseDTO;
import com.github.gubbib.backend.DTO.Comment.CommentUpdateRequestDTO;
import com.github.gubbib.backend.Domain.Comment.Comment;
import com.github.gubbib.backend.Principal.CustomUserPrincipal;
import jakarta.validation.Valid;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface CommentService {
    Comment existsComment(Long postId, Long commentId);

    List<CommentResponseDTO> getAllComments(Long boardId, Long postId);
    CommentResponseDTO createComment(Long boardId, Long postId, CommentCreateRequestDTO request, CustomUserPrincipal userPrincipal);
    CommentResponseDTO updateComment(Long boardId, Long postId, Long commentId, CommentUpdateRequestDTO request, CustomUserPrincipal userPrincipal);

    void deleteComment(Long boardId, Long postId, Long commentId, CustomUserPrincipal userPrincipal);
}
