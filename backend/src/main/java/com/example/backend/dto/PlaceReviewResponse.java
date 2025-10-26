package com.example.backend.dto;

import com.example.backend.entity.PlaceReview;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PlaceReviewResponse {          // 여행 일정 안에서 작성하는 장소 후기
    private Long id;
    private Long placeId;
    private Long userId;
    private String placeName;
    private String username;
    private int rating;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PlaceReviewResponse fromEntity(PlaceReview review) {
        return PlaceReviewResponse.builder()
                .id(review.getId())
                .placeId(review.getPlace().getId())
                .placeName(review.getPlace().getPlaceName())
                .userId(review.getUser().getId())
                .username(review.getUser().getUsername())
                .rating(review.getRating())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
