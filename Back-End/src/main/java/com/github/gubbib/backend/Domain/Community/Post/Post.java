package com.github.gubbib.backend.Domain.Community.Post;

import com.github.gubbib.backend.Domain.BaseEntity;
import com.github.gubbib.backend.Domain.Community.Board.Board;
import com.github.gubbib.backend.Domain.User.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.*;

import com.github.gubbib.backend.Domain.Community.Comment.Comment;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "posts")
public class Post extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Lob
    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    public Post(String title, String content, User user, Board board) {
        this.title = title;
        this.content = content;
        this.user = user;
        this.board = board;
        this.viewCount = 0;
    }

    public void updatePost(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void addComment(Comment comment) {

        if(!comments.contains(comment)) {
            comments.add(comment);
        }
        comment.assignPost(this);
    }
}
