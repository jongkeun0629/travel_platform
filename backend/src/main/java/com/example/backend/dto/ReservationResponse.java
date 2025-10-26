package com.example.backend.dto;

import com.example.backend.entity.Reservation;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public abstract class ReservationResponse {

    private Long id;
    private Long planDetailId;
    private String type;
    private String name;
    private String reservationNo;
    private String memo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private PlaceResponse place;
}
