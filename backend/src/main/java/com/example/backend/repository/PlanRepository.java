package com.example.backend.repository;

import com.example.backend.entity.Plan;
import com.example.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findByUser(User user);

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT p FROM Plan p WHERE p.visibility = '전체 공개' ORDER BY p.createdAt DESC")
    Page<Plan> findAllPlan(Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT p FROM Plan p WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    Page<Plan> findByUserIdAndNotDeleted(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Plan p WHERE p.user.id = :userId ")
    long countByUserIdAndNotDeleted(@Param("userId") Long userId);
}
