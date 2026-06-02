package com.github.gubbib.backend.Service.Post;

import com.github.gubbib.backend.DTO.Post.PostCreateRequestDTO;
import com.github.gubbib.backend.DTO.Post.PostResponseDTO;
import com.github.gubbib.backend.DTO.Post.PostUpdateRequestDTO;
import com.github.gubbib.backend.Domain.Community.Board.Board;
import com.github.gubbib.backend.Domain.Community.Post.Post;
import com.github.gubbib.backend.Domain.User.User;
import com.github.gubbib.backend.Exception.ErrorCode;
import com.github.gubbib.backend.Exception.GlobalException;
import com.github.gubbib.backend.Principal.CustomUserPrincipal;
import com.github.gubbib.backend.Repository.Post.PostRepository;
import com.github.gubbib.backend.Service.Board.BoardService;
import com.github.gubbib.backend.Service.User.UserService;
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
    private final UserService userService;

    @Override
    public Post existsPost(Long boardId, Long postId) {
        return postRepository.findByIdAndBoardIdAndIsDeletedFalse(postId, boardId)
                .orElseThrow(() -> new GlobalException(ErrorCode.POST_NOT_FOUND));
    }

    @Override
    @Transactional
    public PostResponseDTO createPost(Long boardId, PostCreateRequestDTO request, CustomUserPrincipal userPrincipal) {
        Board b = boardService.existsBoard(boardId);
        User u = userService.checkUser(userPrincipal);

        Post post = new Post(
                request.title(),
                request.content(),
                u,
                b
        );

        Post savedPost = postRepository.save(post);

        return PostResponseDTO.from(savedPost);

    }

    @Override
    public List<PostResponseDTO> getAllPosts(Long boardId) {

        Board b = boardService.existsBoard(boardId);

        return postRepository.findByBoardIdAndIsDeletedFalseOrderByCreatedAtDesc(boardId)
                .stream()
                .map(PostResponseDTO::from)
                .toList();
    }

    @Override
    public PostResponseDTO getPost(Long boardId, Long postId) {

        Board b = boardService.existsBoard(boardId);

        // 조회수 증가 로직 추가 필요
        Post p = postRepository.findByIdAndBoardIdAndIsDeletedFalse(postId, b.getId())
                .orElseThrow(() -> new GlobalException(ErrorCode.POST_NOT_FOUND));

        return  PostResponseDTO.from(p);
    }

    @Override
    @Transactional
    public PostResponseDTO updatePost(Long boardId, Long postId, PostUpdateRequestDTO request, CustomUserPrincipal userPrincipal) {

        Board b = boardService.existsBoard(boardId);
        Post p = existsPost(postId, b.getId());

        if(!p.getUser().getId().equals(userPrincipal.getUser().getId())){
            throw new GlobalException(ErrorCode.POST_UPDATE_FORBIDDEN);
        }

        if(!p.getTitle().equals(request.title()) || !p.getContent().equals(request.content())) {
            p.updatePost(request.title(), request.content());
        } else {
            throw new GlobalException(ErrorCode.POST_NO_CHANGES);
        }

        return PostResponseDTO.from(p);
    }

    @Override
    @Transactional
    public void deletePost(Long boardId, Long postId, CustomUserPrincipal userPrincipal) {
        Board b = boardService.existsBoard(boardId);
        Post p = existsPost(postId, b.getId());

        if(!p.getUser().getId().equals(userPrincipal.getUser().getId())){
            throw new GlobalException(ErrorCode.POST_DELETE_FORBIDDEN);
        }

        p.changeIsDeleted();
    }
}
