package com.example.backend.dto;

import com.example.backend.entity.Plan;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanResponse {
    private Long planId;
    private String title;
    private String destination;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String type;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PlanResponse fromEntity(Plan plan) {
        return PlanResponse.builder()
                .planId(plan.getPlanId())
                .title(plan.getTitle())
                .destination(plan.getDestination())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .type(plan.getType())
                .status(plan.getStatus())
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();
    }
}
