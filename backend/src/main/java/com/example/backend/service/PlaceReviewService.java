package com.example.backend.service;

import com.example.backend.dto.PlaceReviewRequest;
import com.example.backend.dto.PlaceReviewResponse;
import com.example.backend.entity.Place;
import com.example.backend.entity.PlaceReview;
import com.example.backend.entity.User;
import com.example.backend.repository.PlaceRepository;
import com.example.backend.repository.PlaceReviewRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaceReviewService {

    private final PlaceReviewRepository placeReviewRepository;
    private final PlaceRepository placeRepository;
    private final UserRepository userRepository;

    public PlaceReviewResponse createReview(PlaceReviewRequest request) {
        Place place = placeRepository.findById(request.getPlaceId())
                .orElseThrow(() -> new IllegalArgumentException("해당 장소를 찾을 수 없습니다."));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        PlaceReview review = PlaceReview.builder()
                .place(place)
                .user(user)
                .rating(request.getRating())
                .content(request.getContent())
                .build();

        placeReviewRepository.save(review);
        return PlaceReviewResponse.fromEntity(review);
    }

    public PlaceReviewResponse updateReview(Long reviewId, PlaceReviewRequest request) {
        PlaceReview review = placeReviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));

        review.setRating(review.getRating());
        review.setContent(review.getContent());

        placeReviewRepository.save(review);
        return PlaceReviewResponse.fromEntity(review);
    }

    public void deleteReview(Long reviewId) {
        PlaceReview review = placeReviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));
        placeReviewRepository.delete(review);
    }

    public List<PlaceReviewResponse> getReviewsByPlace(Long placeId) {
        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("장소를 찾을 수 없습니다."));

        return placeReviewRepository.findByPlace(place)
                .stream()
                .map(PlaceReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PlaceReviewResponse> getAllReviews() {
        return placeReviewRepository.findAll()
                .stream()
                .map(PlaceReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PlaceReviewResponse> getReviewsByKeyword(String keyword) {
        return placeReviewRepository.findByPlaceNameContaining(keyword)
                .stream()
                .map(PlaceReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
