package com.github.gubbib.backend.Service.User;

import com.github.gubbib.backend.Domain.User.User;
import com.github.gubbib.backend.Principal.CustomUserPrincipal;

public interface UserService {
    User checkUser(CustomUserPrincipal userPrincipal);
    User findUser(Long userId);
}
