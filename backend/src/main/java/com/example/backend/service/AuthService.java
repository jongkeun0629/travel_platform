package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.entity.Provider;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
//import com.example.backend.config.PasswordConfig;


//import java.security.AuthProvider;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request){
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
        }
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .username(request.getUsername())
                .birth(request.getBirth())
                .provider(Provider.LOCAL)
                .build();

        user = userRepository.save(user);

        //jwt 토큰 만들기(임시)
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        //authresponse dto로 변환하여 반환하기
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserDto.fromEntity(user))
                .build();
    }
    public AuthResponse login(AuthRequest request){
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new IllegalArgumentException("이메일이 올바르지 않습니다."));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("비번 오류");
        }
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserDto.fromEntity(user))
                .build();
    }
    public AuthResponse refreshToken(RefreshTokenRequest request){
        final String refreshToken = request.getRefreshToken();
        System.out.println(("리프레시토큰 받기 성공"));
        final String username = jwtService.extractUsername(refreshToken);
        System.out.println(("userEmail = "+username));


        if(username != null){
            var user = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("사용자 찾을 수 없음"));
            if (jwtService.isTokenValid(refreshToken, user)) {
                String newAccessToken = jwtService.generateToken(user);
                return AuthResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(refreshToken)
                        .build();
            }
        }
        throw new IllegalArgumentException("Refresh Token is not valid");
    }
}
