package com.github.gubbib.backend.Service.User;

import com.github.gubbib.backend.DTO.Comment.CommentResponseDTO;
import com.github.gubbib.backend.DTO.Post.PostResponseDTO;
import com.github.gubbib.backend.DTO.User.*;
import com.github.gubbib.backend.Domain.User.User;
import com.github.gubbib.backend.Domain.User.UserRole;
import com.github.gubbib.backend.Exception.ErrorCode;
import com.github.gubbib.backend.Exception.GlobalException;
import com.github.gubbib.backend.Principal.CustomUserPrincipal;
import com.github.gubbib.backend.Repository.Comment.CommentRepository;
import com.github.gubbib.backend.Repository.Post.PostRepository;
import com.github.gubbib.backend.Repository.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Override
    public User checkUser(CustomUserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getUser().getId())
                .orElseThrow(() -> new GlobalException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public List<User> findAllByRoleNot(UserRole role) {
        List<User> users = userRepository.findAllByRoleNot(role);

        return users;
    }

    @Override
    public UserInfoDTO me(CustomUserPrincipal customUserPrincipal) {
        User user = checkUser(customUserPrincipal);

        UserInfoDTO userInfoDTO = UserInfoDTO.builder()
                .email(user.getEmail())
                .name(user.getName())
                .nickname(user.getNickname())
                .build();


        return userInfoDTO;
    }

    @Override
    public List<UserMyPostDTO> myPostList(CustomUserPrincipal userPrincipal) {
        User user = checkUser(userPrincipal);

        List<UserMyPostDTO> getMyPosts = postRepository.findMyPostByUserId(user.getId());

        return getMyPosts;
    }

    @Override
    public List<UserMyCommentDTO> myCommentList(CustomUserPrincipal userPrincipal) {
        User user = checkUser(userPrincipal);

        List<UserMyCommentDTO> getMyComments = commentRepository.findMyCommentsByUserId(user.getId());
        return getMyComments;
    }

    @Override
    public void checkNickname(CustomUserPrincipal userPrincipal, String nickname) {

        if(userRepository.existsByNicknameAndRoleNot(nickname, UserRole.SYSTEM)) {
            throw new GlobalException(ErrorCode.USER_NICKNAME_DUPLICATION);
        }
    }

    @Override
    @Transactional(readOnly = false)
    public void modifyNickname(CustomUserPrincipal userPrincipal, ModifyUserNicknameDTO modifyNickname) {
        User user = checkUser(userPrincipal);

        if(userRepository.existsByNicknameAndRoleNot(modifyNickname.modifyNick(),  UserRole.SYSTEM)){
            throw new GlobalException(ErrorCode.USER_NICKNAME_DUPLICATION);
        }

        user.setNickname(modifyNickname.modifyNick());
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = false)
    public void modifyPassword(CustomUserPrincipal userPrincipal, ModifyUserPasswordDTO modifyUserPasswordDTO) {
        User user = checkUser(userPrincipal);

        if(!passwordEncoder.matches(modifyUserPasswordDTO.currentPassword(),  user.getPassword())){
            throw new GlobalException(ErrorCode.USER_PASSWORD_NOT_MATCH);
        }

        if (passwordEncoder.matches(modifyUserPasswordDTO.currentPassword(), modifyUserPasswordDTO.modifyPassword())) {
            throw new GlobalException(ErrorCode.USER_SAME_AS_OLD_PASSWORD);
        }

        user.changePassword(passwordEncoder.encode(modifyUserPasswordDTO.modifyPassword()));
        userRepository.save(user);
    }

    @Override
    public List<PostResponseDTO> getMyPosts(
            CustomUserPrincipal userPrincipal
    ) {

        User user = checkUser(userPrincipal);

        return postRepository
                .findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(
                        user.getId()
                )
                .stream()
                .map(PostResponseDTO::from)
                .toList();
    }

    @Override
    public List<CommentResponseDTO> getMyComments(
            CustomUserPrincipal userPrincipal
    ) {

        User user = checkUser(userPrincipal);

        return commentRepository
                .findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(
                        user.getId()
                )
                .stream()
                .map(CommentResponseDTO::from)
                .toList();
    }

    @Override
    public Long getMyPostsCount(
            CustomUserPrincipal userPrincipal
    ) {

        User user = checkUser(userPrincipal);

        return postRepository.countByUserIdAndIsDeletedFalse(
                user.getId()
        );
    }

    @Override
    public Long getMyCommentsCount(
            CustomUserPrincipal userPrincipal
    ) {

        User user = checkUser(userPrincipal);

        return commentRepository.countByUserIdAndIsDeletedFalse(
                user.getId()
        );
    }
}