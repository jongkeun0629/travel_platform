package com.example.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReservationRequest {
    private Long planDetailId;
    private String type;

    private String reservationNo;
    private String name;
    private String memo;
    private String seat;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private PlaceRequest place;
}
