package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.service.AuthenticationService;
import com.example.backend.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class S3Controller {
    final private AuthenticationService authenticationService;
    final private S3Service s3Service;
    @PostMapping("/profileImage")
    public ResponseEntity<Map<String, String>> uploadProfileImage(@RequestPart("file") MultipartFile file) {
        User currentUser = authenticationService.getCurrentUser();
        String currentName = currentUser.getUsername();
        String url = s3Service.uploadFile(file, currentName+"/");
        currentUser.setProfileImageUrl(url);
        return ResponseEntity.ok(Map.of("url", url));
    }
    //여행후기때 추가 예정?
//    @PostMapping("/image")
//    public ResponseEntity<Map<String, String>> uploadImage(@RequestPart("file") MultipartFile file) {
//        User currentUser = authenticationService.getCurrentUser();
//        String currentName = currentUser.getUsername();
//        String url = s3Service.uploadFile(file, currentName+"/");
//        currentUser.setProfileImageUrl(url);
//        return ResponseEntity.ok(Map.of("url", url));
//    }
}
