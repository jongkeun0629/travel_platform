package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.service.AuthenticationService;
import com.example.backend.service.PhotoService;
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
    final private PhotoService photoService;
    @PostMapping("/profileImage")
    public ResponseEntity<Map<String, String>> uploadProfileImage(@RequestPart("file") MultipartFile file) {
        User currentUser = authenticationService.getCurrentUser();
        String currentName = currentUser.getUsername();
        String url = s3Service.uploadFile(file, currentName+"/");
        currentUser.setProfileImageUrl(url);
        return ResponseEntity.ok(Map.of("url", url));
    }
    @PostMapping("{reviewId}/image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam Long reviewId,
            @RequestPart("file") MultipartFile file) {
        User currentUser = authenticationService.getCurrentUser();
        String currentName = currentUser.getUsername();
        String url = s3Service.uploadFile(file, currentName+"/review/"+reviewId+"/");
        photoService.savePhotoToReview(reviewId, url);
        return ResponseEntity.ok(Map.of("url", url));
    }
}
