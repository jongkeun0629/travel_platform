package com.example.backend.repository;

import com.example.backend.entity.TripReview;
import com.example.backend.entity.TripReviewComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripReviewCommentRepository extends JpaRepository<TripReviewComment, Long> {
    List<TripReviewComment> findByTripReview(TripReview tripReview);
}