package com.example.backend.dto;

import com.example.backend.entity.Reservation;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReservationResponse {

    private Long id;
    private Long planDetailId;
    private String type;
    private String name;

    private String startLocation;
    private String endLocation;
    private String seat;

    private String address;
    private String call;
    private String reservationNo;
    private String memo;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private PlaceResponse place;

    public static ReservationResponse fromEntity(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .planDetailId(
                        reservation.getPlanDetail() != null
                                ? reservation.getPlanDetail().getId()
                                : null
                )
                .type(reservation.getType())
                .name(reservation.getName())
                .startLocation(reservation.getStartLocation())
                .endLocation(reservation.getEndLocation())
                .seat(reservation.getSeat())
                .address(reservation.getAddress())
                .call(reservation.getCall())
                .reservationNo(reservation.getReservationNo())
                .memo(reservation.getMemo())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .place(
                        reservation.getPlace() != null
                                ? PlaceResponse.fromEntity(reservation.getPlace())
                                : null
                )
                .build();
    }
}
