package com.example.backend.dto;

import com.example.backend.entity.AccommodationReservation;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class AccommodationReservationResponse extends ReservationResponse {
    private String address;
    private String call;
    private LocalDateTime checkInDate;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutDate;
    private LocalDateTime checkOutTime;

    public static AccommodationReservationResponse fromEntity(AccommodationReservation reservation) {
        return AccommodationReservationResponse.builder()
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
                .checkInDate(reservation.getCheckInDate())
                .checkInTime(reservation.getCheckInTime())
                .checkOutDate(reservation.getCheckOutDate())
                .checkOutTime(reservation.getCheckOutTime())
                .build();
    }
}
