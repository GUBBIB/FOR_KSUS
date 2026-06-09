package com.github.gubbib.backend.Repository.Post;

import com.github.gubbib.backend.DTO.User.UserMyPostDTO;
import com.github.gubbib.backend.Domain.Community.Post.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByBoardIdAndIsDeletedFalseOrderByCreatedAtDesc(Long boardId);
    Optional<Post> findByIdAndBoardIdAndIsDeletedFalse(Long postId, Long boardId);


    @Query("""
        SELECT new com.github.gubbib.backend.DTO.User.UserMyPostDTO(
                p.title,
                p.content,
                b.title,
                COUNT(c),
                p.id,
                u.id,
                u.nickname,
                p.createdAt
            )
        FROM Post p
        JOIN p.user u
        JOIN p.board b
        LEFT JOIN Comment c ON c.post = p
        WHERE u.id = :userId
        GROUP BY p.id, b.title, u
    """)
    List<UserMyPostDTO> findMyPostByUserId(Long userId);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("""
        UPDATE Post p 
        SET p.viewCount = p.viewCount + :delta
        WHERE p.id = :postId
    """)
    int addViewCount(Long postId, Long delta);

}
