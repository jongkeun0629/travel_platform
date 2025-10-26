package com.example.backend.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;


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
public class User implements UserDetails, OAuth2User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Plan> plans;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = true)
    private LocalDate birth;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(length = 255)
    private String introduction;

    @Enumerated(EnumType.STRING)
    private Provider provider;  // google, kakao, naver 등

    @Column(length = 255)
    private String profileImageUrl;

    private String providerId;

    @CreationTimestamp
    private LocalDate createdAt;

    @UpdateTimestamp
    private LocalDate updatedAt;

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
    public String getPassword() {
        // 일반 로그인이 아니면 null이나 빈 문자열을 반환해도 됨
        return password;
    }

    @Override
    public String getName() {
        // DB의 고유 ID를 반환하는 것이 가장 안전하며 Spring Security에서 권장됩니다.
        return this.id != null ? this.id.toString() : this.email;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_interest",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "interest_id")
    )
    private List<Interest> interests = new ArrayList<>();

}