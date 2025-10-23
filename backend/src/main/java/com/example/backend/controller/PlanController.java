package com.example.backend.controller;

import com.example.backend.dto.PlanRequest;
import com.example.backend.dto.PlanResponse;
import com.example.backend.entity.Plan;
import com.example.backend.service.ItemService;
import com.example.backend.service.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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