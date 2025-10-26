package com.example.backend.repository;

import com.example.backend.entity.Plan;
import com.example.backend.entity.TripReview;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TripReviewRepository extends JpaRepository<TripReview, Long> {
    List<TripReview> findByUser(User user);
    List<TripReview> findByPlan(Plan plan);
    List<TripReview> findByRegionContaining(String region);

    @Query("SELECT COUNT(r) FROM TripReview r WHERE r.user.id = :userId ")
    long countByUserIdAndNotDeleted(@Param("userId") Long userId);
}
