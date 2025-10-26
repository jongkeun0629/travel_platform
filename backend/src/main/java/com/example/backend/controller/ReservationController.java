package com.example.backend.controller;

import com.example.backend.dto.AccommodationReservationRequest;
import com.example.backend.dto.ReservationResponse;
import com.example.backend.dto.RestaurantReservationRequest;
import com.example.backend.dto.TransportReservationRequest;
import com.example.backend.entity.Reservation;
import com.example.backend.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // 교통 예약 생성
    @PostMapping("/transport")
    public ResponseEntity<Reservation> createTransportReservation(@RequestBody TransportReservationRequest request) {
        return ResponseEntity.ok(reservationService.createTransportReservation(request));
    }

    // 숙소 예약 생성
    @PostMapping("/accommodation")
    public ResponseEntity<Reservation> createAccommodationReservation(@RequestBody AccommodationReservationRequest request) {
        return ResponseEntity.ok(reservationService.createAccommodationReservation(request));
    }

    // 음식점 예약 생성
    @PostMapping("/restaurant")
    public ResponseEntity<Reservation> createRestaurantReservation(@RequestBody RestaurantReservationRequest request) {
        return ResponseEntity.ok(reservationService.createRestaurantReservation(request));
    }

    // 교통 예약 수정
    @PutMapping("/transport/{reservationId}")
    public ResponseEntity<Reservation> updateTransportReservation(
            @PathVariable Long reservationId,
            @RequestBody TransportReservationRequest request
    ) {
        return ResponseEntity.ok(reservationService.updateTransportReservation(reservationId, request));
    }

    // 숙소 예약 수정
    @PutMapping("/accommodation/{reservationId}")
    public ResponseEntity<Reservation> updateAccommodationReservation(
            @PathVariable Long reservationId,
            @RequestBody AccommodationReservationRequest request
    ) {
        return ResponseEntity.ok(reservationService.updateAccommodationReservation(reservationId, request));
    }

    // 음식점 예약 수정
    @PutMapping("/restaurant/{reservationId}")
    public ResponseEntity<Reservation> updateRestaurantReservation(
            @PathVariable Long reservationId,
            @RequestBody RestaurantReservationRequest request
    ) {
        return ResponseEntity.ok(reservationService.updateRestaurantReservation(reservationId, request));
    }

    @GetMapping("/planDetail/{planDetailId}")
    public ResponseEntity<List<ReservationResponse>> getReservationByPlan(@PathVariable Long planDetailId) {
        List<ReservationResponse> details = reservationService.getReservationByPlanDetailId(planDetailId);
        return ResponseEntity.ok(details);
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long reservationId) {
        reservationService.deleteReservation(reservationId);
        return ResponseEntity.noContent().build();
    }
}
