package com.example.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "accommodation_reservation")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class AccommodationReservation extends Reservation {
    private String address;
    private String call;
    private LocalDateTime checkInDate;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutDate;
    private LocalDateTime checkOutTime;
}
