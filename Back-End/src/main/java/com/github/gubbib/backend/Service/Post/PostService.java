package com.github.gubbib.backend.Service.Post;

import com.github.gubbib.backend.DTO.Post.PostCreateRequestDTO;
import com.github.gubbib.backend.DTO.Post.PostResponseDTO;
import com.github.gubbib.backend.Principal.CustomUserPrincipal;

import java.util.List;

public interface PostService {

    PostResponseDTO createPost(Long boardId, PostCreateRequestDTO request, CustomUserPrincipal userPrincipal);
    List<PostResponseDTO> getAllPosts(Long boardId);
}
