package com.example.backend.config;

import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class PasswordConfig {
    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return loginId -> {
            try {
                Long userId = Long.parseLong(loginId);
                return userRepository.findById(userId)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));
            } catch (NumberFormatException e) {
                return userRepository.findByEmail(loginId)
                        .or(() -> userRepository.findByUsername(loginId))
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            }
        };
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
