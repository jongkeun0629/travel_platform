package com.example.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "transport_reservation")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class TransportReservation extends Reservation {
    private String startLocation;
    private String endLocation;
    private String seat;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
