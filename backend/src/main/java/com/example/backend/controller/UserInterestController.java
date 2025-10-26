package com.example.backend.controller;

import com.example.backend.dto.InterestRequestDto;
import com.example.backend.dto.InterestResponseDto;
import com.example.backend.service.AuthenticationService;
import com.example.backend.service.UserInterestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/interests")
@RequiredArgsConstructor
public class UserInterestController {
    private final AuthenticationService authenticationService;

    private final UserInterestService userInterestService;

    @GetMapping
    public ResponseEntity<InterestResponseDto> getUserInterests() {
        Long userId = authenticationService.getCurrentUser().getId();
        InterestResponseDto response = userInterestService.getUserInterests(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<InterestResponseDto> updateUserInterests(
            @RequestBody InterestRequestDto requestDto
    ) {
        Long userId = authenticationService.getCurrentUser().getId();

        InterestResponseDto response = userInterestService.updateUserInterests(userId, requestDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{interestName}")
    public ResponseEntity<InterestResponseDto> removeUserInterest(
            @PathVariable Long userId,
            @PathVariable String interestName
    ) {
        InterestResponseDto response = userInterestService.removeUserInterest(userId, interestName);
        return ResponseEntity.ok(response);
    }

}
