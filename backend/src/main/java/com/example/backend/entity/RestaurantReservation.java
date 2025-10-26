package com.example.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "restaurant_reservation")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class RestaurantReservation extends Reservation {
    private String address;
    private String call;
    private LocalDateTime reservationDate;
    private LocalDateTime reservationTime;
}
