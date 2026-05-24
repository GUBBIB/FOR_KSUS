package com.github.gubbib.backend.Service.Post;

import com.github.gubbib.backend.DTO.Post.PostCreateRequestDTO;
import com.github.gubbib.backend.DTO.Post.PostResponseDTO;
import com.github.gubbib.backend.Domain.Board.Board;
import com.github.gubbib.backend.Domain.Post.Post;
import com.github.gubbib.backend.Principal.CustomUserPrincipal;
import com.github.gubbib.backend.Repository.Post.PostRepository;
import com.github.gubbib.backend.Service.Board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly=true)
@RequiredArgsConstructor(onConstructor_ =  @Autowired)
public class PostServiceImp implements PostService{

    private final BoardService boardService;
    private final PostRepository postRepository;

    @Override
    @Transactional
    public PostResponseDTO createPost(Long boardId, PostCreateRequestDTO request, CustomUserPrincipal userPrincipal) {
        Board b = boardService.existsBoard(boardId);

        Post post = new Post(
                request.title(),
                request.content(),
                userPrincipal.getUser(),
                b
        );

        Post savedPost = postRepository.save(post);

        return PostResponseDTO.from(savedPost);

    }

    @Override
    public List<PostResponseDTO> getAllPosts(Long boardId) {

        Board b = boardService.existsBoard(boardId);

        return postRepository.findByBoardIdOrderByCreatedAtDesc(boardId)
                .stream()
                .map(PostResponseDTO::from)
                .toList();
    }
}
