package com.github.gubbib.backend.Domain.User;

import lombok.Getter;

@Getter
public enum UserRole {
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN"),
    SYSTEM("ROLE_SYSTEM");

    private final String roleName;

    UserRole(String roleName) {
        this.roleName = roleName;
    }

}
