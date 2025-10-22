package com.example.backend.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
<<<<<<< HEAD
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Map;
=======
>>>>>>> origin/develop

import java.time.LocalDate;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_email", columnList = "email"),
        @Index(name = "idx_username", columnList = "username")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
<<<<<<< HEAD
public class User implements UserDetails, OAuth2User {
=======
public class User {
>>>>>>> origin/develop

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

<<<<<<< HEAD
    @Column(nullable = true)
=======
    @Column(nullable = false)
>>>>>>> origin/develop
    private LocalDate birth;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(length = 255)
    private String introduction;

<<<<<<< HEAD
    @Enumerated(EnumType.STRING)
    private Provider provider;  // google, kakao, naver 등
=======
    @Column(length = 50)
    private String provider;  // google, kakao, naver 등
>>>>>>> origin/develop

    @Column(length = 255)
    private String profileImageUrl;

<<<<<<< HEAD
    private String providerId;
=======
    private Long providerId;
>>>>>>> origin/develop

    @CreationTimestamp
    private LocalDate createdAt;

    @UpdateTimestamp
    private LocalDate updatedAt;
<<<<<<< HEAD

    @Transient // JPA가 DB 컬럼으로 매핑하지 않도록 합니다.
    private Map<String, Object> attributes;

    @Override
    public Map<String, Object> getAttributes() {
        // 소셜 서비스에서 받은 원본 속성을 반환
        // 보통 CustomOAuth2UserService에서 받은 attributes를 저장해뒀다가 반환합니다.
        // 또는 Map.of("id", this.id, "email", this.email, ...) 형태로 반환할 수도 있습니다.
        return this.attributes;
    }

    @Override
    public String getName() { return String.valueOf(this.attributes.get("sub")); } // 사용자 식별자(보통 id나 sub) 반환

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }
=======
>>>>>>> origin/develop
}