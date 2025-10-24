package com.example.backend.controller;

import com.example.backend.dto.UserEditResponseRequest;
import com.example.backend.service.AuthenticationService;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/profile")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AuthenticationService authenticationService;

    @GetMapping
    public ResponseEntity<UserEditResponseRequest> getUser(){
        Long userId = authenticationService.getCurrentUser().getId();

        System.out.println(userId);
        UserEditResponseRequest Response = userService.getUser(userId);
        return ResponseEntity.ok(Response);
    }

    @PutMapping
    public ResponseEntity<UserEditResponseRequest> updateUser( @RequestBody UserEditResponseRequest request){
        Long userId = authenticationService.getCurrentUser().getId();
        UserEditResponseRequest response = userService.updateUser(userId, request);
        return ResponseEntity.ok(response);
    }
}
