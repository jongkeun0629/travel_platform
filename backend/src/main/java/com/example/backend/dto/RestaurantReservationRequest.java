package com.example.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
public class RestaurantReservationRequest extends ReservationRequest {
    private String name;
    private String address;
    private LocalDateTime reservationDate;
    private LocalDateTime reservationTime;
    private String call;
    private String reservationNo;
    private String memo;
}
