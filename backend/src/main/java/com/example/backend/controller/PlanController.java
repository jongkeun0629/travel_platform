package com.example.backend.controller;

import com.example.backend.dto.PlanRequest;
import com.example.backend.dto.PlanResponse;
import com.example.backend.entity.Plan;
import com.example.backend.service.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    @PostMapping
    public ResponseEntity<PlanResponse> createPlan(
            @RequestBody PlanRequest request,
            @RequestParam Long userId
    ) {
        Plan createdPlan = planService.createPlan(request, userId);
        return ResponseEntity.ok(PlanResponse.fromEntity(createdPlan));
    }

    public ResponseEntity<List<PlanResponse>> getPlansByUser(@RequestParam Long userId) {
        List<Plan> plans = planService.getPlansByUser(userId);
        List<PlanResponse> responseList = plans.stream()
                .map(PlanResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(responseList);
    }

    @PutMapping("/{planId}")
    public ResponseEntity<PlanResponse> updatePlan(
            @PathVariable Long planId,
            @RequestBody PlanRequest request
    ) {
        Plan updatedPlan = planService.updatedPlan(planId, request);
        return ResponseEntity.ok(PlanResponse.fromEntity(updatedPlan));
    }

    @DeleteMapping("/{planId}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long planId) {
        planService.deletePlan(planId);
        return ResponseEntity.noContent().build();
    }
}