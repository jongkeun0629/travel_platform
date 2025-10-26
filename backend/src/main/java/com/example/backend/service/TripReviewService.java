package com.example.backend.service;

import com.example.backend.dto.TripReviewRequest;
import com.example.backend.dto.TripReviewResponse;
import com.example.backend.entity.Plan;
import com.example.backend.entity.TripReview;
import com.example.backend.entity.User;
import com.example.backend.repository.PlanRepository;
import com.example.backend.repository.TripReviewRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripReviewService {

    private final TripReviewRepository tripReviewRepository;
    private final UserRepository userRepository;
    private final PlanRepository planRepository;

    public TripReviewResponse createTripReview(TripReviewRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Plan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new IllegalArgumentException("여행 계획을 찾을 수 없습니다."));

        TripReview review = TripReview.builder()
                .user(user)
                .plan(plan)
                .title(request.getTitle())
                .rating(request.getRating())
                .content(request.getContent())
                .build();

        tripReviewRepository.save(review);
        return TripReviewResponse.fromEntity(review);
    }

    public TripReviewResponse updateTripReview(Long id, TripReviewRequest request) {
        TripReview review = tripReviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));

        review.setTitle(request.getTitle());
        review.setRating(request.getRating());
        review.setRegion(review.getRegion());
        review.setContent(review.getContent());

        tripReviewRepository.save(review);
        return TripReviewResponse.fromEntity(review);
    }

    public void deleteTripReview(Long id) {
        TripReview review = tripReviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));
        tripReviewRepository.delete(review);
    }

    // 특정 유저로 후기 검색
    public List<TripReviewResponse> getReviewsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return tripReviewRepository.findByUser(user)
                .stream()
                .map(TripReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 지역으로 후기 검색
    public List<TripReviewResponse> getReviewsByRegion(String region) {
        return tripReviewRepository.findByRegionContaining(region)
                .stream()
                .map(TripReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<TripReviewResponse> getAllReviews() {
        return tripReviewRepository.findAll()
                .stream()
                .map(TripReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
