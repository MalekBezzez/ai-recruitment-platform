package com.example.employeemodule.controller;


import com.example.employeemodule.Service.TrainingRecommendationPlanService;
import com.example.employeemodule.dto.CoachingDTO;
import com.example.employeemodule.dto.SelfTrainingDTO;
import com.example.employeemodule.dto.StructuredTrainingDTO;
import com.example.employeemodule.dto.TrainingRecommendationPlanSummaryDTO;
import com.example.employeemodule.entity.TrainingRecommendationPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/training-recommendation-plans")
@RequiredArgsConstructor
public class TrainingRecommendationPlanController {

    private final TrainingRecommendationPlanService trainingRecommendationPlanService;

    @GetMapping("/summary")
    public ResponseEntity<List<TrainingRecommendationPlanSummaryDTO>> getAllPlanSummaries() {
        List<TrainingRecommendationPlanSummaryDTO> summaries = trainingRecommendationPlanService.getAllPlanSummaries();
        return ResponseEntity.ok(summaries);
    }

    @PostMapping
    public ResponseEntity<TrainingRecommendationPlan> createPlan(@RequestBody TrainingRecommendationPlan plan) {
        TrainingRecommendationPlan savedPlan = trainingRecommendationPlanService.savePlan(plan);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPlan);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingRecommendationPlan> getPlanById(@PathVariable Long id) {
        TrainingRecommendationPlan plan = trainingRecommendationPlanService.getPlanById(id);
        return plan != null ? ResponseEntity.ok(plan) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<TrainingRecommendationPlan>> getAllPlans() {
        return ResponseEntity.ok(trainingRecommendationPlanService.getAllPlans());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        trainingRecommendationPlanService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingRecommendationPlan> updatePlan(@PathVariable Long id, @RequestBody TrainingRecommendationPlan plan) {
        plan.setId(id);
        TrainingRecommendationPlan updatedPlan = trainingRecommendationPlanService.updatePlan(plan);
        return ResponseEntity.ok(updatedPlan);
    }

    @GetMapping("/{planId}/self-trainings")
    public ResponseEntity<Map<String, List<SelfTrainingDTO>>> getSelfTrainingByPlanId(
            @PathVariable Long planId) {

        Map<String, List<SelfTrainingDTO>> result =
                trainingRecommendationPlanService.getSelfTrainingByPlanId(planId);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{planId}/coachings")
    public ResponseEntity<List<CoachingDTO>> getCoachingByPlanId(@PathVariable Long planId) {
        List<CoachingDTO> coachings = trainingRecommendationPlanService.getCoachingByPlanId(planId);
        return ResponseEntity.ok(coachings);
    }

    @GetMapping("/{planId}/structured-trainings")
    public ResponseEntity<List<StructuredTrainingDTO>> getStructuredTrainingByPlanId(@PathVariable Long planId) {
        List<StructuredTrainingDTO> trainings = trainingRecommendationPlanService.getStructuredTrainingByPlanId(planId);
        return ResponseEntity.ok(trainings);
    }



}
