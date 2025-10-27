package com.example.backend.controller;

import com.example.backend.dto.PlaceReviewRequest;
import com.example.backend.dto.PlaceReviewResponse;
import com.example.backend.entity.PlaceReview;
import com.example.backend.service.PlaceReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/place-reviews")
@RequiredArgsConstructor
public class PlaceReviewController {

    private final PlaceReviewService placeReviewService;

    @PostMapping
    public ResponseEntity<PlaceReviewResponse> createReview(@RequestBody PlaceReviewRequest request) {
        return ResponseEntity.ok(placeReviewService.createReview(request));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<PlaceReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @RequestBody PlaceReviewRequest request
    ) {
        return ResponseEntity.ok(placeReviewService.updateReview(reviewId, request));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        placeReviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/place/{placeId}")
    public ResponseEntity<List<PlaceReviewResponse>> getByPlace(@PathVariable Long placeId) {
        List<PlaceReview> reviews = placeReviewService.findByPlaceId(placeId);
        List<PlaceReviewResponse> result = reviews.stream()
                .map(PlaceReviewResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(result);
    }


    @GetMapping
    public ResponseEntity<List<PlaceReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(placeReviewService.getAllReviews());
    }

    @GetMapping("/search")
    public ResponseEntity<List<PlaceReviewResponse>> searchReviews(@RequestParam String keyword) {
        return ResponseEntity.ok(placeReviewService.getReviewsByKeyword(keyword));
    }
}
