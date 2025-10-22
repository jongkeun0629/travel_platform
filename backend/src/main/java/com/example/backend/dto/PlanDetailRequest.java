package com.example.backend.dto;

import lombok.Data;

@Data
public class PlanDetailRequest {
    private Long planId;
    private Long placeId;
    private String day;
    private String reserveInfo;
    private String details;
}
