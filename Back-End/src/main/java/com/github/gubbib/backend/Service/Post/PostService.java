package com.github.gubbib.backend.Service.Post;

import com.github.gubbib.backend.DTO.Post.PostCreateRequestDTO;
import com.github.gubbib.backend.DTO.Post.PostResponseDTO;
import com.github.gubbib.backend.DTO.Post.PostUpdateRequestDTO;
import com.github.gubbib.backend.Domain.Community.Post.Post;
import com.github.gubbib.backend.Principal.CustomUserPrincipal;

import java.util.List;

public interface PostService {

    Post existsPost(Long boardId, Long postId);
    PostResponseDTO createPost(Long boardId, PostCreateRequestDTO request, CustomUserPrincipal userPrincipal);
    List<PostResponseDTO> getAllPosts(Long boardId);
    PostResponseDTO getPost(CustomUserPrincipal userPrincipal, Long boardId, Long postId);
    PostResponseDTO updatePost(Long boardId, Long postId, PostUpdateRequestDTO request, CustomUserPrincipal userPrincipal);
    void deletePost(Long boardId, Long postId, CustomUserPrincipal userPrincipal);
    PostResponseDTO createNoticePost(PostCreateRequestDTO request, CustomUserPrincipal userPrincipal);
    PostResponseDTO updateNoticePost(Long postId, PostUpdateRequestDTO request);
    void deleteNoticePost(Long postId);
}
