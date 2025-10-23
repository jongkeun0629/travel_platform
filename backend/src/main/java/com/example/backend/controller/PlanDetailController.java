package com.example.backend.controller;

import com.example.backend.dto.PlanDetailRequest;
import com.example.backend.entity.Plan;
import com.example.backend.entity.PlanDetail;
import com.example.backend.service.PlanDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plan-details")
@RequiredArgsConstructor
public class PlanDetailController {

    private final PlanDetailService planDetailService;

    @PostMapping
    public ResponseEntity<PlanDetail> createPlanDetail(@RequestBody PlanDetailRequest request) {
        PlanDetail createdDetail = planDetailService.createPlanDetail(request);
        return ResponseEntity.ok(createdDetail);
    }

    @GetMapping("/plan/{planId}")
    public ResponseEntity<List<PlanDetail>> getPlanDetailsByPlan(@PathVariable Long planId) {
        List<PlanDetail> details = planDetailService.getPlanDetailsByPlanId(planId);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/{detailId}")
    public ResponseEntity<PlanDetail> getPlanDetailById(@PathVariable Long detailId) {
        PlanDetail detail = planDetailService.getPlanDetailById(detailId);
        return ResponseEntity.ok(detail);
    }

    @PutMapping("/{detailId}")
    public ResponseEntity<PlanDetail> updatePlanDetail(
            @PathVariable Long detailId,
            @RequestBody PlanDetailRequest request
    ) {
        PlanDetail updatedDetail = planDetailService.updatePlanDetail(detailId, request);
        return ResponseEntity.ok(updatedDetail);
    }

    @DeleteMapping("/{detailId}")
    public ResponseEntity<Void> deletePlanDetail(@PathVariable Long detailId) {
        planDetailService.deletePlanDetail(detailId);
        return ResponseEntity.noContent().build();
    }
}
