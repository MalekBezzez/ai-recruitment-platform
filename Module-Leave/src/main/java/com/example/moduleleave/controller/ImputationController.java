package com.example.moduleleave.controller;

import com.example.moduleleave.dto.ImputationDTO;
import com.example.moduleleave.Service.ImputationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/imputations")
public class ImputationController {

    @Autowired
    private ImputationService service;

    @GetMapping
    public List<ImputationDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ImputationDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ImputationDTO create(@RequestBody ImputationDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ImputationDTO update(@PathVariable Long id, @RequestBody ImputationDTO dto) {
        return service.update(id, dto);
    }
    @PutMapping("/{id}/description")
    public ResponseEntity<Void> updateDescription(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {
        String newDescription = request.get("description");
        service.updateImputationDescription(id, newDescription);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
    @GetMapping("/user/{userId}")
    public List<ImputationDTO> getByUserId(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }
    @GetMapping("/user/{userId}/invalid")
    public List<ImputationDTO> getInvalidImputationsByUserId(@PathVariable Long userId) {
        return service.getInvalidImputationsByUserId(userId);
    }
    @GetMapping("/absences/user/{userId}")
    public ResponseEntity<List<ImputationDTO>> getAbsencesByUserId(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        // Assuming absences are stored as Imputation entities with projectId set to an "Absence" project
        List<ImputationDTO> absences = service.getByUserId(userId).stream()
                .filter(dto -> dto.getTaskId() == null && dto.getProjectId() != null) // Filter for absences
                .filter(dto -> {
                    LocalDate date = dto.getDate();
                    return date != null && !date.isBefore(start) && !date.isAfter(end);
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(absences);
    }
    @PutMapping("/{id}/validate")
    public ResponseEntity<Void> validateImputation(@PathVariable Long id) {
        service.validateImputation(id);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/user/{userId}/invalid")
    public ResponseEntity<Void> deleteInvalidImputationsByUserId(@PathVariable Long userId) {
        service.deleteInvalidImputationsByUserId(userId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}/draft")
    public ResponseEntity<Void> markAsDraft(@PathVariable Long id) {
        service.markAsDraft(id);
        return ResponseEntity.ok().build();
    }

}

