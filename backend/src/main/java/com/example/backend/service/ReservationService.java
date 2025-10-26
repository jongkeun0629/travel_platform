package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.entity.*;
import com.example.backend.repository.PlaceRepository;
import com.example.backend.repository.PlanDetailRepository;
import com.example.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final PlanDetailRepository planDetailRepository;
    private final PlaceRepository placeRepository;
    private final ReservationRepository reservationRepository;

    @Transactional
    public Reservation createTransportReservation(TransportReservationRequest request) {
        PlanDetail planDetail = getPlanDetailById(request.getPlanDetailId());
        Place place = resolvePlaceFromRequest(request.getPlace());

        TransportReservation reservation = TransportReservation.builder()
                .planDetail(planDetail)
                .type("교통")
                .name(request.getName())
                .startLocation(request.getStartLocation())
                .endLocation(request.getEndLocation())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .seat(request.getSeat())
                .reservationNo(request.getReservationNo())
                .memo(request.getMemo())
                .place(place)
                .build();

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation createAccommodationReservation(AccommodationReservationRequest request) {
        PlanDetail planDetail = getPlanDetailById(request.getPlanDetailId());
        Place place = resolvePlaceFromRequest(request.getPlace());

        AccommodationReservation reservation = AccommodationReservation.builder()
                .planDetail(planDetail)
                .type("숙소")
                .name(request.getName())
                .address(request.getAddress())
                .checkInDate(request.getCheckInDate())
                .checkInTime(request.getCheckInTime())
                .checkOutDate(request.getCheckOutDate())
                .checkOutTime(request.getCheckOutTime())
                .call(request.getCall())
                .reservationNo(request.getReservationNo())
                .memo(request.getMemo())
                .place(place)
                .build();

        return reservationRepository.save(reservation);
    }


    @Transactional
    public Reservation createRestaurantReservation(RestaurantReservationRequest request) {
        PlanDetail planDetail = getPlanDetailById(request.getPlanDetailId());
        Place place = resolvePlaceFromRequest(request.getPlace());

        RestaurantReservation reservation = RestaurantReservation.builder()
                .planDetail(planDetail)
                .type("음식점")
                .name(request.getName())
                .address(request.getAddress())
                .reservationDate(request.getReservationDate())
                .reservationTime(request.getReservationTime())
                .call(request.getCall())
                .reservationNo(request.getReservationNo())
                .memo(request.getMemo())
                .place(place)
                .build();

        return reservationRepository.save(reservation);
    }


    @Transactional
    public Reservation updateTransportReservation(Long reservationId, TransportReservationRequest request) {
        Reservation reservation = getReservationById(reservationId);
        if (!(reservation instanceof TransportReservation)) {
            throw new IllegalArgumentException("예약 타입이 일치하지 않습니다.");
        }
        TransportReservation transportReservation = (TransportReservation) reservation;
        Place place = resolvePlaceFromRequest(request.getPlace());

        transportReservation.setType("교통");
        transportReservation.setName(request.getName());
        transportReservation.setStartLocation(request.getStartLocation());
        transportReservation.setEndLocation(request.getEndLocation());
        transportReservation.setStartTime(request.getStartTime());
        transportReservation.setEndTime(request.getEndTime());
        transportReservation.setSeat(request.getSeat());
        transportReservation.setReservationNo(request.getReservationNo());
        transportReservation.setMemo(request.getMemo());
        transportReservation.setPlace(place);

        return reservationRepository.save(transportReservation);
    }

    @Transactional
    public Reservation updateAccommodationReservation(Long reservationId, AccommodationReservationRequest request) {
        Reservation reservation = getReservationById(reservationId);
        if (!(reservation instanceof AccommodationReservation)) {
            throw new IllegalArgumentException("예약 타입이 일치하지 않습니다. 요청된 타입: 숙소");
        }
        AccommodationReservation accommodationReservation = (AccommodationReservation) reservation;
        Place place = resolvePlaceFromRequest(request.getPlace());

        accommodationReservation.setType("숙소");
        accommodationReservation.setName(request.getName());
        accommodationReservation.setAddress(request.getAddress());
        accommodationReservation.setCheckInDate(request.getCheckInDate());
        accommodationReservation.setCheckInTime(request.getCheckInTime());
        accommodationReservation.setCheckOutDate(request.getCheckOutDate());
        accommodationReservation.setCheckOutTime(request.getCheckOutTime());
        accommodationReservation.setCall(request.getCall());
        accommodationReservation.setReservationNo(request.getReservationNo());
        accommodationReservation.setMemo(request.getMemo());
        accommodationReservation.setPlace(place);

        return reservationRepository.save(accommodationReservation);
    }

    @Transactional
    public Reservation updateRestaurantReservation(Long reservationId, RestaurantReservationRequest request) {
        Reservation reservation = getReservationById(reservationId);
        if (!(reservation instanceof RestaurantReservation)) {
            throw new IllegalArgumentException("예약 타입이 일치하지 않습니다. 요청된 타입: 음식점");
        }
        RestaurantReservation restaurantReservation = (RestaurantReservation) reservation;
        Place place = resolvePlaceFromRequest(request.getPlace());

        restaurantReservation.setType("음식점");
        restaurantReservation.setName(request.getName());
        restaurantReservation.setAddress(request.getAddress());
        restaurantReservation.setReservationDate(request.getReservationDate());
        restaurantReservation.setReservationTime(request.getReservationTime());
        restaurantReservation.setCall(request.getCall());
        restaurantReservation.setReservationNo(request.getReservationNo());
        restaurantReservation.setMemo(request.getMemo());
        restaurantReservation.setPlace(place);

        return reservationRepository.save(restaurantReservation);
    }


    public List<ReservationResponse> getReservationByPlanDetailId(Long planDetailId) {
        List<Reservation> reservations = reservationRepository.findByPlanDetailId(planDetailId);
        return reservations.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    // reservation 엔티티 타입에 따라 적절한 DTO로 매핑하는 private 메서드
    private ReservationResponse mapToResponseDto(Reservation reservation) {
        if (reservation instanceof TransportReservation) {
            return TransportReservationResponse.fromEntity((TransportReservation) reservation);
        } else if (reservation instanceof AccommodationReservation) {
            return AccommodationReservationResponse.fromEntity((AccommodationReservation) reservation);
        } else if (reservation instanceof RestaurantReservation) {
            return RestaurantReservationResponse.fromEntity((RestaurantReservation) reservation);
        } else {
            throw new IllegalArgumentException("지원하지 않는 예약 타입입니다.");
        }
    }

    @Transactional
    public void deleteReservation(Long reservationId) {
        Reservation reservation = getReservationById(reservationId);
        reservationRepository.delete(reservation);
    }

    private PlanDetail getPlanDetailById(Long planDetailId) {
        return planDetailRepository.findById(planDetailId)
                .orElseThrow(() -> new IllegalArgumentException("상세 일정을 찾을 수 없습니다."));
    }

    private Reservation getReservationById(Long reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));
    }

//    public Reservation updateReservation(Long reservationId, ReservationRequest request) {
//        Reservation reservation = reservationRepository.findById(reservationId)
//                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));
//
//        Place place = resolvePlaceFromRequest(request.getPlace());
//
//        reservation.setType(request.getType());
//        reservation.setReservationNo(request.getReservationNo());
//        reservation.setMemo(request.getMemo());
//        reservation.setStartTime(request.getStartTime());
//        reservation.setEndTime(request.getEndTime());
//        reservation.setSeat(request.getSeat());
//        reservation.setPlace(place);
//
//        return reservationRepository.save(reservation);
//    }

    // backend/src/main/java/com/example/backend/service/ReservationService.java

// ✅ 수정: 214-224번 라인
private Place resolvePlaceFromRequest(PlaceRequest placeRequest) {
    if (placeRequest == null)
        return null;  // ✅ null을 반환하도록 수정
    
    if (placeRequest.getKakaoPlaceId() != null && !placeRequest.getKakaoPlaceId().isBlank()) {
        return placeRepository.findByKakaoPlaceId(placeRequest.getKakaoPlaceId())
                .orElseGet(() -> placeRepository.save(toPlace(placeRequest)));
    }
    
    // ✅ place 정보가 있지만 kakaoPlaceId가 없으면 그냥 save
    if (placeRequest.getPlaceName() != null && !placeRequest.getPlaceName().isBlank()) {
        return placeRepository.save(toPlace(placeRequest));
    }
    
    return null;  // ✅ 아무 정보도 없으면 null 반환
}

    private Place toPlace(PlaceRequest pr) {
        return Place.builder()
                .placeName(pr.getPlaceName())
                .address(pr.getAddress())
                .call(pr.getCall())
                .classification(pr.getClassification())
                .kakaoPlaceId(pr.getKakaoPlaceId())
                .build();
    }
}