package com.example.back.controller;


import com.example.back.entity.WorkMode;
import com.example.back.Service.WorkModeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/work-modes")
@RequiredArgsConstructor
public class WorkModeController {

    private final WorkModeService workModeService;

    // CREATE
    @PostMapping
    public ResponseEntity<WorkMode> createWorkMode(@RequestBody WorkMode workMode) {
        return ResponseEntity.ok(workModeService.saveWorkMode(workMode));
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<WorkMode>> getAllWorkModes() {
        return ResponseEntity.ok(workModeService.getAllWorkModes());
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<WorkMode> getWorkModeById(@PathVariable Long id) {
        return ResponseEntity.ok(workModeService.getWorkModeById(id));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<WorkMode> updateWorkMode(@PathVariable Long id, @RequestBody WorkMode workMode) {
        return ResponseEntity.ok(workModeService.updateWorkMode(id, workMode));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkMode(@PathVariable Long id) {
        workModeService.deleteWorkMode(id);
        return ResponseEntity.noContent().build();
    }


}
