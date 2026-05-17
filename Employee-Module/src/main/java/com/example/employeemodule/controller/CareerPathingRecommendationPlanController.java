package com.example.employeemodule.controller;


import com.example.employeemodule.Service.CareerPathingRecommendationPlanService;
import com.example.employeemodule.dto.CareerPathingRecommendationPlanSummaryDTO;
import com.example.employeemodule.dto.CareerPathingResultDTO;
import com.example.employeemodule.entity.CareerPathingRecommendationPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career-pathing-plans")
@RequiredArgsConstructor
public class CareerPathingRecommendationPlanController {

    private final CareerPathingRecommendationPlanService service;

    // Créer un nouveau plan
    @PostMapping
    public ResponseEntity<CareerPathingRecommendationPlan> createPlan(@RequestBody CareerPathingRecommendationPlan plan) {
        CareerPathingRecommendationPlan savedPlan = service.save(plan);
        return ResponseEntity.ok(savedPlan);
    }

    // Récupérer un plan par son id
    @GetMapping("/{id}")
    public ResponseEntity<CareerPathingRecommendationPlan> getPlanById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Récupérer tous les plans
    @GetMapping
    public ResponseEntity<List<CareerPathingRecommendationPlan>> getAllPlans() {
        List<CareerPathingRecommendationPlan> plans = service.getAll();
        return ResponseEntity.ok(plans);
    }

    // Mettre à jour un plan
    @PutMapping("/{id}")
    public ResponseEntity<CareerPathingRecommendationPlan> updatePlan(@PathVariable Long id,
                                                                      @RequestBody CareerPathingRecommendationPlan plan) {
        return service.getById(id)
                .map(existingPlan -> {
                    // Ici tu peux mettre à jour les champs nécessaires
                    plan.setId(id); // s'assurer que l'id est bien celui du path
                    CareerPathingRecommendationPlan updatedPlan = service.update(plan);
                    return ResponseEntity.ok(updatedPlan);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Supprimer un plan
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Récupérer la liste des résumés de plans
    @GetMapping("/summary")
    public ResponseEntity<List<CareerPathingRecommendationPlanSummaryDTO>> getAllPlansSummary() {
        List<CareerPathingRecommendationPlanSummaryDTO> summaries = service.getAllPlansSummary();
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/plan/{planId}/results")
    public ResponseEntity<List<CareerPathingResultDTO>> getCareerPathingResults(
            @PathVariable Long planId) {

        List<CareerPathingResultDTO> results = service.getCareerPathingResultByPlanId(planId);
        return ResponseEntity.ok(results);
    }

}
