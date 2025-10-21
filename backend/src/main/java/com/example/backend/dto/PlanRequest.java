package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PlanRequest {
    private String title;
    private String destination;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String type;
}
