package com.github.gubbib.backend.Repository.Comment;

import com.github.gubbib.backend.Domain.Community.Comment.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdAndIsDeletedFalseOrderByCreatedAtAsc(Long postId);
    Optional<Comment> findByIdAndPostIdAndIsDeletedFalse(Long commentId, Long postId);
}
