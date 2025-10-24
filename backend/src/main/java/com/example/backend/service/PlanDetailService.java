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
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanDetailService {

    private final PlanRepository planRepository;
    private final PlaceRepository placeRepository;
    private final PlanDetailRepository planDetailRepository;

    public PlanDetail createPlanDetail(PlanDetailRequest request) {
        Plan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new IllegalArgumentException("해당 여행 계획을 찾을 수 없습니다."));

        Place place = resolvePlaceFromRequest(request);

        PlanDetail planDetail = PlanDetail.builder()
                .plan(plan)
                .place(place)
                .tripday(request.getTripday())
                .reserveInfo(request.getReserveInfo())
                .placeType(request.getPlaceType())
                .details(request.getDetails())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return planDetailRepository.save(planDetail);
    }

    public PlanDetail updatePlanDetail(Long detailId, PlanDetailRequest request) {
        PlanDetail planDetail = planDetailRepository.findById(detailId)
                .orElseThrow(() -> new IllegalArgumentException("해당 계획 상세를 찾을 수 없습니다."));

        Place place = resolvePlaceFromRequest(request);

        planDetail.setPlace(place);
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

    private Place resolvePlaceFromRequest(PlanDetailRequest request) {
        // 1) 기존 placeId로 연결
        if (request.getPlaceId() != null) {
            return placeRepository.findById(request.getPlaceId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 장소를 찾을 수 없습니다."));
        }

        // 2) 본문에 새 장소 정보(place)가 왔을 때
        PlaceRequest pr = request.getPlace();
        if (pr == null) {
            throw new IllegalArgumentException("장소 정보가 필요합니다. (placeId 또는 place)");
        }

        // 2-1) kakaoPlaceId 있는 경우 → 중복 체크 후 재사용/생성
        if (pr.getKakaoPlaceId() != null && !pr.getKakaoPlaceId().isBlank()) {
            return placeRepository.findByKakaoPlaceId(pr.getKakaoPlaceId())
                    .orElseGet(() -> placeRepository.save(toPlace(pr)));
        }

        // 2-2) 사용자 직접 입력(카카오 place id 없음)
        return placeRepository.save(toPlace(pr));
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

    public List<PlanDetail> getPlanDetailsByPlanId(Long planId) {
        return planDetailRepository.findByPlanId(planId);
    }

    public PlanDetail getPlanDetailById(Long detailId) {
        return planDetailRepository.findById(detailId)
                .orElseThrow(() -> new IllegalArgumentException("해당 상세 계획을 찾을 수 없습니다."));
    }
}
