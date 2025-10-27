package com.example.backend.repository;

import com.example.backend.entity.Place;
import com.example.backend.entity.PlaceReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlaceReviewRepository extends JpaRepository<PlaceReview, Long> {
    List<PlaceReview> findByPlace_Id(Long placeId);

    @Query("SELECT r FROM PlaceReview r WHERE r.place.placeName LIKE %:keyword%")
    List<PlaceReview> findByPlaceNameContaining(@Param("keyword") String keyword);
}
