package com.example.backend.dto;

import com.example.backend.entity.TransportReservation;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class TransportReservationResponse extends ReservationResponse {
    private String startLocation;
    private String endLocation;
    private String seat;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public static TransportReservationResponse fromEntity(TransportReservation reservation) {
        return TransportReservationResponse.builder()
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
                .startLocation(reservation.getStartLocation())
                .endLocation(reservation.getEndLocation())
                .seat(reservation.getSeat())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                .build();
    }
}
