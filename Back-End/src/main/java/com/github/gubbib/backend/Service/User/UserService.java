package com.github.gubbib.backend.Service.User;

import com.github.gubbib.backend.DTO.Comment.CommentResponseDTO;
import com.github.gubbib.backend.DTO.Post.PostResponseDTO;
import com.github.gubbib.backend.DTO.User.*;
import com.github.gubbib.backend.Domain.User.User;
import com.github.gubbib.backend.Domain.User.UserRole;
import com.github.gubbib.backend.Principal.CustomUserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

public interface UserService {
    User checkUser(CustomUserPrincipal userPrincipal);
    User findUser(Long userId);
    List<User> findAllByRoleNot(UserRole role);
    UserInfoDTO me(@AuthenticationPrincipal CustomUserPrincipal userPrincipal);
    List<UserMyPostDTO> myPostList(@AuthenticationPrincipal CustomUserPrincipal userPrincipal);
    List<UserMyCommentDTO> myCommentList(@AuthenticationPrincipal CustomUserPrincipal userPrincipal);
    void checkNickname(@AuthenticationPrincipal CustomUserPrincipal userPrincipal, String nickname);

    void modifyNickname(@AuthenticationPrincipal CustomUserPrincipal userPrincipal, ModifyUserNicknameDTO modifyNickname);
    void modifyPassword(@AuthenticationPrincipal CustomUserPrincipal userPrincipal, ModifyUserPasswordDTO modifyUserPasswordDTO);

    List<PostResponseDTO> getMyPosts(CustomUserPrincipal userPrincipal);
    List<CommentResponseDTO> getMyComments(CustomUserPrincipal userPrincipal);

    Long getMyPostsCount(CustomUserPrincipal userPrincipal);
    Long getMyCommentsCount(CustomUserPrincipal userPrincipal);
}