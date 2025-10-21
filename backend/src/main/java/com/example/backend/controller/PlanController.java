package com.example.backend.controller;

import com.example.backend.dto.PlanRequest;
import com.example.backend.dto.PlanResponse;
import com.example.backend.entity.Plan;
import com.example.backend.service.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/{planId}")
    public
}
