package com.example.backend.dto;

import com.example.backend.entity.Provider;
import com.example.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
//    private String fullName;
    private String introduction;
    private String profileImageUrl;
    private Provider provider;

    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
//                .fullName(user.getFullName())
                .introduction(user.getIntroduction())
                .profileImageUrl(user.getProfileImageUrl())
                .provider(user.getProvider())
                .build();
    }
}
