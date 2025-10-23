package com.example.backend.controller;

import com.example.backend.dto.UserEditResponseRequest;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/{userId}")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserEditResponseRequest> getUser(@PathVariable Long userId){
        UserEditResponseRequest Response = userService.getUser(userId);
        return ResponseEntity.ok(Response);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserEditResponseRequest> updateUser(@PathVariable Long userId, @RequestBody UserEditResponseRequest request){
        UserEditResponseRequest response = userService.updateUser(userId, request);
        return ResponseEntity.ok(response);
    }

    //post profile_image
}
