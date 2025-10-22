package com.example.backend.repository;

import com.example.backend.entity.PlanDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanDetailRepository extends JpaRepository<PlanDetail, Long> {

}
