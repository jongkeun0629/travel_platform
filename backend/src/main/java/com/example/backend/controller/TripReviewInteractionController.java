package com.example.backend.controller;

import com.example.backend.entity.TripReviewComment;
import com.example.backend.service.TripReviewInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trip-reviews")
@RequiredArgsConstructor
public class TripReviewInteractionController {

    private final TripReviewInteractionService interactionService;

    @PostMapping("/{reviewId}/comments")
    public ResponseEntity<TripReviewComment> addComment(
            @PathVariable Long reviewId,
            @RequestParam Long userId,
            @RequestParam String content
    ) {
        return ResponseEntity.ok(interactionService.addComment(reviewId, userId, content));
    }

    @GetMapping("/{reviewId}/comments")
    public ResponseEntity<List<TripReviewComment>> getComments(@PathVariable Long reviewId) {
        return ResponseEntity.ok(interactionService.getComments(reviewId));
    }

    @PostMapping("/{reviewId}/like")
    public ResponseEntity<String> toggleLike(
            @PathVariable Long reviewId,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(interactionService.toggleLike(reviewId, userId));
    }

    @GetMapping("/{reviewId}/likes")
    public ResponseEntity<Long> countLikes(@PathVariable Long reviewId) {
        return ResponseEntity.ok(interactionService.countLikes(reviewId));
    }
}
