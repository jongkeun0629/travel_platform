package com.example.backend.repository;

import com.example.backend.entity.Plan;
import com.example.backend.entity.TripReview;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripReviewRepository extends JpaRepository<TripReview, Long> {
    List<TripReview> findByUser(User user);
    List<TripReview> findByPlan(Plan plan);
    List<TripReview> findByRegionContaining(String region);
}
