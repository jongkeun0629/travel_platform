package com.example.backend.dto;

import com.example.backend.entity.PlaceReview;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Long placeId;
    private String placeName;
    private String username;
    private int rating;
    private String content;
    private LocalDateTime createdAt;

    public static ReviewResponse fromEntity(PlaceReview placeReview) {
        return ReviewResponse.builder()
                .id(placeReview.getId())
                .placeId(placeReview.getPlace().getId())
                .placeName(placeReview.getPlace().getPlaceName())
                .username(placeReview.getUser().getUsername())
                .rating(placeReview.getRating())
                .content(placeReview.getContent())
                .createdAt(placeReview.getCreatedAt())
                .build();
    }
}
