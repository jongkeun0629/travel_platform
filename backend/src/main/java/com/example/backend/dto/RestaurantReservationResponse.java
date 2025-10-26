package com.example.backend.dto;

import com.example.backend.entity.RestaurantReservation;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class RestaurantReservationResponse extends ReservationResponse {
    private String address;
    private String call;
    private LocalDateTime reservationDate;
    private LocalDateTime reservationTime;

    public static RestaurantReservationResponse fromEntity(RestaurantReservation reservation) {
        return RestaurantReservationResponse.builder()
                .id(reservation.getId())
                .planDetailId(
                        reservation.getPlanDetail() != null ? reservation.getPlanDetail().getId() : null
                )
                .type(reservation.getType())
                .name(reservation.getName())
                .reservationNo(reservation.getReservationNo())
                .memo(reservation.getMemo())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .place(
                        reservation.getPlace() != null ? PlaceResponse.fromEntity(reservation.getPlace()) : null
                )
                .address(reservation.getAddress())
                .call(reservation.getCall())
                .reservationDate(reservation.getReservationDate())
                .reservationTime(reservation.getReservationTime())
                .build();
    }
}
