package com.github.gubbib.backend.Repository.Post;

import com.github.gubbib.backend.Domain.Community.Post.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByBoardIdAndIsDeletedFalseOrderByCreatedAtDesc(Long boardId);
    Optional<Post> findByIdAndBoardIdAndIsDeletedFalse(Long postId, Long boardId);
}
