package com.github.gubbib.backend.Domain.User;

import com.github.gubbib.backend.Domain.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "users")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;
    @Column(name = "password", nullable = false,  length = 255)
    private String password;
    @Column(name = "name",  nullable = false,  length = 255)
    private String name;
    @Setter
    @Column(name = "nickname", nullable = false, unique = true, length = 255)
    private String nickname;

    @Column(name = "is_students", nullable = true)
    private boolean isStudents;

    @Enumerated(EnumType.STRING)
    @Column(name="role", nullable = false)
    private UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    @Column(name="provider", nullable = false)
    private Provider provider = Provider.LOCAL;


    public static User createLocal(String email, String password, String name, String nickname){
        User u = new User();

        u.email = email;
        u.password = password;
        u.name = name;
        u.nickname = nickname;
        u.provider = Provider.LOCAL;

        return u;
    }

    public static User createOauth2(String email, String name, String nickname, Provider provider){
        User u = new User();

        u.email = email;
        u.password = UUID.randomUUID().toString();
        u.name = name;
        u.nickname = nickname;
        u.provider = provider;

        return u;
    }

    public void changePassword(String password){
        this.password = password;
    }
    public void verifyStudent(){
        this.isStudents = true;
    }
}
