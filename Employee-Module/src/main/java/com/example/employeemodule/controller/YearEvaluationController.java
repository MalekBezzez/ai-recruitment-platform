package com.example.back.controller;


import com.example.employeemodule.entity.YearEvaluation;
import com.example.employeemodule.Service.YearEvaluationService;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/year-evaluations")
public class YearEvaluationController {

    @Autowired
    private YearEvaluationService yearEvaluationService;

    @GetMapping
    public List<YearEvaluation> getAllYearEvaluations() {
        return yearEvaluationService.getAllYearEvaluations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<YearEvaluation> getYearEvaluationById(@PathVariable int id) {
        return yearEvaluationService.getYearEvaluationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public YearEvaluation createYearEvaluation(@RequestBody YearEvaluation yearEvaluation) {
        return yearEvaluationService.saveYearEvaluation(yearEvaluation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<YearEvaluation> updateYearEvaluation(@PathVariable int id, @RequestBody YearEvaluation yearEvaluationDetails) {
        return ResponseEntity.ok(yearEvaluationService.updateYearEvaluation(id, yearEvaluationDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteYearEvaluation(@PathVariable int id) {
        yearEvaluationService.deleteYearEvaluation(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/add-to-employee/{employeId}")
    public ResponseEntity<?> addYearEvaluationToEmploye(@PathVariable  Long employeId, @RequestBody YearEvaluation yearEvaluation) {

        YearEvaluation createdEvaluation = yearEvaluationService.addYearEvaluationToEmploye(employeId, yearEvaluation);
        return ResponseEntity.ok(createdEvaluation);
    }
    @GetMapping("/employee/{employeId}")
    public ResponseEntity<List<YearEvaluation>> getYearEvaluationsByEmployeId(@PathVariable Long employeId) {
        List<YearEvaluation> evaluations = yearEvaluationService.getYearEvaluationsByEmployeId(employeId);
        return ResponseEntity.ok(evaluations);
    }
    }