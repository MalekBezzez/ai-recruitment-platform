package com.example.moduleproject.controller;

import com.example.moduleproject.dto.PhaseDTO;
import com.example.moduleproject.Service.PhaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/phases")
public class PhaseController {

    @Autowired
    private PhaseService phaseService;

    @GetMapping
    public List<PhaseDTO> getAll() {
        return phaseService.getAll();
    }
    @PutMapping("/{id}")
    public PhaseDTO update(@PathVariable Long id, @RequestBody PhaseDTO dto) {
        return phaseService.update(id, dto);
    }



    @GetMapping("/project/{projectId}")
    public List<PhaseDTO> getByProjectId(@PathVariable Long projectId) {
        return phaseService.getByProjectId(projectId);
    }

    @GetMapping("/{id}")
    public PhaseDTO getById(@PathVariable Long id) {
        return phaseService.getById(id);
    }

    @PostMapping
    public PhaseDTO create(@RequestBody PhaseDTO dto) {
        return phaseService.create(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        phaseService.delete(id);
    }
}
