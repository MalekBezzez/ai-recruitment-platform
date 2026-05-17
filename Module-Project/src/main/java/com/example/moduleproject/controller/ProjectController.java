package com.example.moduleproject.controller;

import com.example.moduleproject.Service.ProjectService;
import com.example.moduleproject.dto.ProjectDTO;
import com.example.moduleproject.dto.ProjectNameIdDTO;
import com.example.moduleproject.entity.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public List<ProjectDTO> getAll() {
        return projectService.getAll();
    }

    @GetMapping("/{id}")
    public ProjectDTO getById(@PathVariable Long id) {
        return projectService.getById(id);
    }
    @GetMapping("/names-ids")
    public List<ProjectNameIdDTO> getAllProjectNamesAndIds() {
        return projectService.getAllProjectNamesAndIds();
    }

    @PostMapping
    public ProjectDTO create(@RequestBody ProjectDTO dto) {
        return projectService.create(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        projectService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @RequestBody ProjectDTO dto) {
        try {
            ProjectDTO updated = projectService.update(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build(); // Ou une réponse d'erreur personnalisée
        }}
    @GetMapping("/absence")
    public ProjectDTO getOrCreateAbsenceProject() {
        return projectService.getOrCreateAbsenceProject();
    }

}
