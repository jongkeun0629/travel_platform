package com.example.backend.dto;

import lombok.Data;

@Data
public class PlaceReviewRequest {          // 여행 일정 안에서 작성하는 장소 후기
    private Long placeId;
    private Long userId;
    private int rating;
    private String content;
}
