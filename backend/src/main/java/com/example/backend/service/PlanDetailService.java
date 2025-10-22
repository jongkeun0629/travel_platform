package com.example.backend.service;

import com.example.backend.dto.PlaceRequest;
import com.example.backend.dto.PlanDetailRequest;
import com.example.backend.entity.Place;
import com.example.backend.entity.Plan;
import com.example.backend.entity.PlanDetail;
import com.example.backend.repository.PlaceRepository;
import com.example.backend.repository.PlanDetailRepository;
import com.example.backend.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PlanDetailService {

    private final PlanRepository planRepository;
    private final PlaceRepository placeRepository;
    private final PlanDetailRepository planDetailRepository;

    public PlanDetail createPlanDetail(PlanDetailRequest request) {
        Plan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new IllegalArgumentException("해당 여행 계획을 찾을 수 없습니다."));

        Place place = null;
        if (request.getPlaceId() != null) {
            place = placeRepository.findById(request.getPlaceId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 장소를 찾을 수 없습니다."));
        }

        PlanDetail planDetail = PlanDetail.builder()
                .plan(plan)
                .place(place)
                .tripday(request.getTripday())
                .reserveInfo(request.getReserveInfo())
                .placeType(request.getPlaceType())
                .details(request.getDetails())
                .createdAt(LocalDateTime.now())
                .build();

        return planDetailRepository.save(planDetail);
    }

    public PlanDetail updatePlanDetail(Long detailId, PlanDetailRequest request) {
        PlanDetail planDetail = planDetailRepository.findById(detailId)
                .orElseThrow(() -> new IllegalArgumentException("해당 계획 상세를 찾을 수 없습니다."));

        Place place = null;
        if (request.getPlaceId() != null) {
            place = placeRepository.findById(request.getPlaceId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 장소를 찾을 수 없습니다."));
        } else if (request.getPlace() != null) {
            PlaceRequest placeReq = request.getPlace();
            place = Place.builder()
                    .placeName(placeReq.getPlaceName())
                    .address(placeReq.getAddress())
                    .call(placeReq.getCall())
                    .classification(placeReq.getClassification())
                    .build();
            placeRepository.save(place);
        }

        if (place != null) {
            planDetail.setPlace(place);
        }

        planDetail.setTripday(request.getTripday());
        planDetail.setReserveInfo(request.getReserveInfo());
        planDetail.setPlaceType(request.getPlaceType());
        planDetail.setDetails(request.getDetails());
        planDetail.setUpdatedAt(LocalDateTime.now());

        return planDetailRepository.save(planDetail);
    }


    public void deletePlanDetail(Long detailId) {
        PlanDetail planDetail = planDetailRepository.findById(detailId)
                .orElseThrow(() -> new IllegalArgumentException("해당 계획 상세를 찾을 수 없습니다."));
        planDetailRepository.delete(planDetail);
    }
}
