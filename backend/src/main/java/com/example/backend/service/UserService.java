package com.example.backend.service;

import com.example.backend.dto.UserEditResponseRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public UserEditResponseRequest getUser(Long userId){
        User user = userRepository.findById(userId).get();

        return UserEditResponseRequest.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .introduction(user.getIntroduction())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }
    public UserEditResponseRequest updateUser(Long userId, UserEditResponseRequest request){
        User user = userRepository.findById(userId).get();

        user.setUsername(request.getUsername());
        user.setIntroduction(request.getIntroduction());
        userRepository.save(user);
        UserEditResponseRequest response = UserEditResponseRequest.builder()
                .username(user.getUsername())
                .introduction(user.getIntroduction())
                .build();

        return response;
    }
}
