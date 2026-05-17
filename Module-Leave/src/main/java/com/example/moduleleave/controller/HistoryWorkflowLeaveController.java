package com.example.moduleleave.controller;

import com.example.moduleleave.dto.HistoryWorkflowLeaveDto;
import com.example.moduleleave.Service.HistoryWorkflowLeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/historyleaves")
public class HistoryWorkflowLeaveController {

    private final HistoryWorkflowLeaveService service;

    public HistoryWorkflowLeaveController(HistoryWorkflowLeaveService service) {
        this.service = service;
    }

    @GetMapping
    public List<HistoryWorkflowLeaveDto> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public HistoryWorkflowLeaveDto getOne(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<HistoryWorkflowLeaveDto> create(
            @RequestBody HistoryWorkflowLeaveDto dto) {
        HistoryWorkflowLeaveDto created = service.create(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public HistoryWorkflowLeaveDto update(
            @PathVariable Long id,
            @RequestBody HistoryWorkflowLeaveDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}