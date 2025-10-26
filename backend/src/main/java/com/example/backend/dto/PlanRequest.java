package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PlanRequest {
    private String title;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private String type;
    private String visibility;
}
