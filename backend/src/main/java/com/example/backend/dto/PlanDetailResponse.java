package com.example.backend.dto;

import com.example.backend.entity.PlanDetail;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PlanDetailResponse {
    private Long id;
    private Long planId;
    private Long placeId;
    private String tripday;
    private String reserveInfo;
    private String placeType;
    private String details;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PlanDetailResponse fromEntity(PlanDetail detail) {
        return PlanDetailResponse.builder()
                .id(detail.getId())
                .planId(detail.getPlan() != null ? detail.getPlan().getId() : null)
                .placeId(detail.getPlace() != null ? detail.getPlace().getId() : null)
                .tripday(detail.getTripday())
                .reserveInfo(detail.getReserveInfo())
                .placeType(detail.getPlaceType())
                .details(detail.getDetails())
                .createdAt(detail.getCreatedAt())
                .updatedAt(detail.getUpdatedAt())
                .build();
    }
}
