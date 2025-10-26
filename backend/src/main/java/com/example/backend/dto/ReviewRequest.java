package com.example.backend.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long planDetailId;
    private Long placeId;
    private Long userId;
    private int rating;
    private String content;
}
