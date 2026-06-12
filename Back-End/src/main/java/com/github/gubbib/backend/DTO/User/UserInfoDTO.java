package com.github.gubbib.backend.DTO.User;

import lombok.Builder;

@Builder
public record UserInfoDTO(
        String email,
        String nickname,
        String name,
        String role
) {
}