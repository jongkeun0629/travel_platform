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
    private LocalDate startDate;
    private LocalDate endDate;
    private String type;
    private String status;
    private String visibility;
    private UserDto user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PlanResponse fromEntity(Plan plan) {
        return PlanResponse.builder()
                .planId(plan.getId())
                .title(plan.getTitle())
                .destination(plan.getDestination())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .type(plan.getType())
                .status(plan.getStatus())
                .visibility(plan.getVisibility())
                .user(UserDto.fromEntity(plan.getUser()))
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();
    }
}
