package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservationRequest {
    private Long planDetailId;
    private String type;              // 교통 / 숙소 / 음식점
    private String name;
    private String startLocation;
    private String endLocation;
    private String address;
    private String call;
    private String seat;
    private String reservationNumber;
    private String memo;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
