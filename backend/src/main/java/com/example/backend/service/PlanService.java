package com.example.backend.service;

import com.example.backend.dto.PlanRequest;
import com.example.backend.entity.Plan;
import com.example.backend.entity.User;
import com.example.backend.repository.PlanRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;
    private final UserRepository userRepository;

    public Plan getPlanById(Long planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("여행 계획을 찾을 수 없습니다."));
    }

    public Plan createPlan(PlanRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        Plan plan = Plan.builder()
                .title(request.getTitle())
                .destination(request.getDestination())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .type(request.getType())
                .user(user)
                .status("planned")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return planRepository.save(plan);
    }

    public Plan updatedPlan(Long planId, PlanRequest request) {
        Plan plan = getPlanById(planId);

        plan.setTitle(request.getTitle());
        plan.setDestination(request.getDestination());
        plan.setStartDate(request.getStartDate());
        plan.setEndDate(request.getEndDate());
        plan.setType(request.getType());
        plan.setUpdatedAt(LocalDateTime.now());

        return planRepository.save(plan);
    }

    public void deletePlan(Long planId) {
        Plan plan = getPlanById(planId);
        planRepository.delete(plan);
    }

    public List<Plan> getPlansByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return planRepository.findByUser(user);
    }

}
