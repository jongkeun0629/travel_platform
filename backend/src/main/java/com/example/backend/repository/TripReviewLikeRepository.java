package com.example.backend.repository;

import com.example.backend.entity.TripReview;
import com.example.backend.entity.TripReviewLike;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripReviewLikeRepository extends JpaRepository<TripReviewLike, Long> {
    boolean existsByTripReviewAndUser(TripReview tripReview, User user);
    long countByTripReview(TripReview tripReview);
    void deleteByTripReviewAndUser(TripReview tripReview, User user);
}