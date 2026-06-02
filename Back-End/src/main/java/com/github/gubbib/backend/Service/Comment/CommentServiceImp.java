package com.github.gubbib.backend.Service.Comment;

import com.github.gubbib.backend.DTO.Comment.CommentCreateRequestDTO;
import com.github.gubbib.backend.DTO.Comment.CommentResponseDTO;
import com.github.gubbib.backend.DTO.Comment.CommentUpdateRequestDTO;
import com.github.gubbib.backend.Domain.Community.Comment.Comment;
import com.github.gubbib.backend.Domain.Community.Post.Post;
import com.github.gubbib.backend.Domain.User.User;
import com.github.gubbib.backend.Exception.ErrorCode;
import com.github.gubbib.backend.Exception.GlobalException;
import com.github.gubbib.backend.Principal.CustomUserPrincipal;
import com.github.gubbib.backend.Repository.Comment.CommentRepository;
import com.github.gubbib.backend.Service.Post.PostService;
import com.github.gubbib.backend.Service.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly=true)
@RequiredArgsConstructor(onConstructor_ =  @Autowired)
public class CommentServiceImp implements CommentService {

    private final CommentRepository commentRepository;
    private final PostService postService;
    private final UserService userService;

    @Override
    public Comment existsComment(Long postId, Long commentId) {
        return commentRepository.findByIdAndPostIdAndIsDeletedFalse(commentId, postId)
                .orElseThrow(() -> new GlobalException(ErrorCode.COMMENT_NOT_FOUND));
    }

    @Override
    public List<CommentResponseDTO> getAllComments(Long boardId, Long postId) {
        Post p = postService.existsPost(postId, boardId);

        return commentRepository.findByPostIdAndIsDeletedFalseOrderByCreatedAtAsc(p.getId())
                .stream()
                .map(CommentResponseDTO::from)
                .toList();
    }

    @Override
    @Transactional
    public CommentResponseDTO createComment(Long boardId, Long postId, CommentCreateRequestDTO request, CustomUserPrincipal userPrincipal) {

        Post p = postService.existsPost(postId, boardId);
        User u = userService.checkUser(userPrincipal);

        Comment comment = new Comment(
                request.content(),
                u
        );

        p.addComment(comment);
        Comment savedComment = commentRepository.save(comment);

        return  CommentResponseDTO.from(savedComment);
    }

    @Override
    @Transactional
    public CommentResponseDTO updateComment(Long boardId, Long postId, Long commentId, CommentUpdateRequestDTO request, CustomUserPrincipal userPrincipal) {
        Post p = postService.existsPost(postId, boardId);
        Comment c = existsComment(postId, commentId);
        User u = userService.checkUser(userPrincipal);

        if(!c.getUser().getId().equals(u.getId())) {
            throw new GlobalException(ErrorCode.COMMENT_UPDATE_FORBIDDEN);
        }

        if(!c.getContent().equals(request.content())) {
            c.updateComment(request.content());
        } else {
            throw new GlobalException(ErrorCode.COMMENT_NO_CHANGES);
        }

        return CommentResponseDTO.from(c);
    }

    @Override
    @Transactional
    public void deleteComment(Long boardId, Long postId, Long commentId, CustomUserPrincipal userPrincipal) {
        Post p = postService.existsPost(postId, boardId);
        Comment c = existsComment(postId, commentId);
        User u = userService.checkUser(userPrincipal);

        if(!c.getUser().getId().equals(u.getId())) {
            throw new GlobalException(ErrorCode.COMMENT_DELETE_FORBIDDEN);
        }

        c.changeIsDeleted();
    }
}
