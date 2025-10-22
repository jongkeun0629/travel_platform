package com.example.backend.controller;


import com.example.backend.dto.*;
import com.example.backend.service.AuthService;
import com.example.backend.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final EmailService emailService; // 인증 로직을 담당할 서비스

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody AuthRequest request
    ){
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-verification-email")
    public ResponseEntity<CodeRequest> sendVerificationCode(@RequestBody CodeRequest request
){
    emailService.sendCode(request.getEmail());
    return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(
            @Valid @RequestBody CodeRequest request
    ){
        boolean verified = emailService.verifyCode(request.getEmail(),request.getCode());
        if(verified){
            return ResponseEntity.ok().body("이메일 인증이 완료되었습니다.");
        }else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 코드가 유효하지 않거나 만료되었습니다.");
        }
    }
}
