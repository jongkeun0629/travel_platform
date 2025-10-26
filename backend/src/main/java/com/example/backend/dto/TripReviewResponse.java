package com.example.backend.dto;

import com.example.backend.entity.TripReview;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TripReviewResponse {
    private Long id;
    private Long userId;
    private String username;
    private Long planId;
    private String title;
    private int rating;
    private String region;
    private String content;
    private LocalDateTime createdAt;

    public static TripReviewResponse fromEntity(TripReview review) {
        return TripReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .username(review.getUser().getUsername())
                .planId(review.getPlan().getId())
                .title(review.getTitle())
                .rating(review.getRating())
                .region(review.getRegion())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
