package com.example.backend.service;

import com.example.backend.dto.PlaceRequest;
import com.example.backend.dto.ReservationRequest;
import com.example.backend.entity.Place;
import com.example.backend.entity.PlanDetail;
import com.example.backend.entity.Reservation;
import com.example.backend.repository.PlaceRepository;
import com.example.backend.repository.PlanDetailRepository;
import com.example.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final PlanDetailRepository planDetailRepository;
    private final PlaceRepository placeRepository;
    private final ReservationRepository reservationRepository;

    public Reservation createReservation(ReservationRequest request) {
        PlanDetail planDetail = planDetailRepository.findById(request.getPlanDetailId())
                .orElseThrow(() -> new IllegalArgumentException("상세 일정을 찾을 수 없습니다."));

        Place place = resolvePlaceFromRequest(request.getPlace());

        Reservation reservation = Reservation.builder()
                .planDetail(planDetail)
                .type(request.getType())
                .reservationNo(request.getReservationNo())
                .memo(request.getMemo())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .seat(request.getSeat())
                .place(place)
                .build();

        return reservationRepository.save(reservation);
    }

    public Reservation updateReservation(Long reservationId, ReservationRequest request) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));

        Place place = resolvePlaceFromRequest(request.getPlace());

        reservation.setType(request.getType());
        reservation.setReservationNo(request.getReservationNo());
        reservation.setMemo(request.getMemo());
        reservation.setStartTime(request.getStartTime());
        reservation.setEndTime(request.getEndTime());
        reservation.setSeat(request.getSeat());
        reservation.setPlace(place);

        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));
        reservationRepository.delete(reservation);
    }

    private Place resolvePlaceFromRequest(PlaceRequest placeRequest) {
        if (placeRequest == null)
            throw new IllegalArgumentException("장소 정보가 필요합니다.");

        if (placeRequest.getKakaoPlaceId() != null && !placeRequest.getKakaoPlaceId().isBlank()) {
            return placeRepository.findByKakaoPlaceId(placeRequest.getKakaoPlaceId())
                    .orElseGet(() -> placeRepository.save(toPlace(placeRequest)));
        }

        return placeRepository.save(toPlace(placeRequest));
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