package com.example.backend.controller;

import com.example.backend.dto.PlanRequest;
import com.example.backend.dto.PlanResponse;
import com.example.backend.entity.Plan;
import com.example.backend.service.ItemService;
import com.example.backend.service.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;
    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<PlanResponse> createPlan(
            @RequestBody PlanRequest request,
            @RequestParam Long userId
    ) {
        System.out.println(userId);
        Plan createdPlan = planService.createPlan(request, userId);
        itemService.InitialItem(createdPlan);

        return ResponseEntity.ok(PlanResponse.fromEntity(createdPlan));
    }

    @GetMapping
    public ResponseEntity<Page<PlanResponse>> getAllPlans(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PlanResponse> plans = planService.getAllPlans(pageable);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{planId}")
    public ResponseEntity<PlanResponse> getPlanById(@PathVariable Long planId) {
        PlanResponse plan = planService.getPlanByIdd(planId);
        return ResponseEntity.ok(plan);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PlanResponse>> getUserPlans(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PlanResponse> plans = planService.getUserPlans(userId, pageable);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Map<String, Long>> getUserPlanCount(@PathVariable Long userId) {
        Long count = planService.getUserPlanCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
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