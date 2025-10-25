package com.example.backend.controller;

import com.example.backend.dto.TripReviewRequest;
import com.example.backend.dto.TripReviewResponse;
import com.example.backend.service.TripReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trip-reviews")
@RequiredArgsConstructor
public class TripReviewController {

    private final TripReviewService tripReviewService;

    @PostMapping
    public ResponseEntity<TripReviewResponse> createReview(@RequestBody TripReviewRequest request) {
        return ResponseEntity.ok(tripReviewService.createTripReview(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripReviewResponse> updateReview(
            @PathVariable Long id,
            @RequestBody TripReviewRequest request) {
        return ResponseEntity.ok(tripReviewService.updateTripReview(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        tripReviewService.deleteTripReview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<TripReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(tripReviewService.getAllReviews());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TripReviewResponse>> getReviewsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(tripReviewService.getReviewsByUser(userId));
    }

    @GetMapping("/region")
    public ResponseEntity<List<TripReviewResponse>> getReviewsByRegion(@RequestParam String region) {
        return ResponseEntity.ok(tripReviewService.getReviewsByRegion(region));
    }
}
