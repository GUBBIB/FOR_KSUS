package com.github.gubbib.backend.Repository.Comment;

import com.github.gubbib.backend.DTO.User.UserMyCommentDTO;
import com.github.gubbib.backend.Domain.Community.Comment.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdAndIsDeletedFalseOrderByCreatedAtAsc(Long postId);
    Optional<Comment> findByIdAndPostIdAndIsDeletedFalse(Long commentId, Long postId);


    @Query("""
        SELECT new com.github.gubbib.backend.DTO.User.UserMyCommentDTO(
            c.id,
            c.content,
            p.id,
            p.title,
            b.id,
            b.title,
            u.id,
            u.nickname,
            c.createdAt
            )
        FROM Comment c
        JOIN c.post p
        JOIN p.board b
        JOIN c.user u
        WHERE u.id = :userId
        ORDER BY c.createdAt DESC
    """)
    List<UserMyCommentDTO> findMyCommentsByUserId(Long userId);
}
