package com.example.backend.dto;

import lombok.Data;

@Data
public class TripReviewRequest {
    private Long userId;
    private Long planId;
    private String title;
    private int rating;
    private String region;
    private String content;
}
