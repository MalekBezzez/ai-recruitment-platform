package com.example.moduleproject.controller;


import com.example.moduleproject.Service.PhaseService;
import com.example.moduleproject.Service.TaskService;
import com.example.moduleproject.dto.*;
import com.example.moduleproject.entity.Phase;
import com.example.moduleproject.entity.Task;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private PhaseService phaseService;
    @Autowired
    private EntityManager entityManager;



    @GetMapping
    public List<TaskDTO1> getAll() {
        return taskService.getAll();
    }

    @GetMapping("/phase/{phaseId}")
    public List<TaskDTO1> getByPhaseId(@PathVariable Long phaseId) {
        return taskService.getByPhaseId(phaseId);
    }

    @GetMapping("/{id}")
    public TaskDTO1 getById(@PathVariable Long id) {
        return taskService.getById(id);
    }
    @GetMapping("/{taskId}/project-phase")
    public ResponseEntity<TaskPhaseProjectDTO> getProjectAndPhaseByTaskId(@PathVariable Long taskId) {
        try {
            TaskDTO1 task = taskService.getById(taskId);
            if (task == null) {
                return ResponseEntity.notFound().build();
            }

            Long phaseId = task.getPhaseId();
            PhaseDTO phase = phaseService.getById(phaseId);
            if (phase == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(new TaskPhaseProjectDTO(taskId, phaseId, phase.getProjectId()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @PostMapping
    public TaskDTO1 create(@RequestBody TaskDTO1 dto) {
        return taskService.create(dto);
    }
    @GetMapping("/count/phase/{phaseId}")
    public long countByPhase(@PathVariable Long phaseId) {
        return taskService.countByPhaseId(phaseId);
    }
    @PatchMapping("/edit/{id}")
    public ResponseEntity<TaskDTO1> update(@PathVariable Long id, @RequestBody TaskDTO1 dto) {
        try {
            TaskDTO1 updatedTask = taskService.update(id, dto);
            return ResponseEntity.ok(updatedTask);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        taskService.delete(id);
    }

    @GetMapping("/phase/{phaseId}/roots")
    public List<TaskDTO1> getRootTasks(@PathVariable Long phaseId) {
        return taskService.getRootTasksByPhaseId(phaseId);
    }
    @GetMapping("/{id}/name")
    public ResponseEntity<String> getTaskNameById(@PathVariable Long id) {
        try {
            TaskDTO1 task = taskService.getById(id);
            return ResponseEntity.ok(task.getName());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tâche non trouvée");
        }
    }

    @GetMapping("/{parentTaskId}/subtasks")
    public List<TaskDTO1> getSubTasks(@PathVariable Long parentTaskId) {
        return taskService.getSubTasks(parentTaskId);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TaskDTO1> updateActualTime(@PathVariable Long id, @RequestBody TaskActualTimeUpdateDTO updateDTO) {
        Task updatedTask = taskService.updateActualTime(id, updateDTO);
        TaskDTO1 responseDto = taskService.convertToDTO(updatedTask); // Create a method to convert Task to TaskDTO1
        return ResponseEntity.ok(responseDto);
    }
    @GetMapping("/project/{projectId}")
    public List<TaskDTO1> getByProjectId(@PathVariable Long projectId) {
        return taskService.getByProjectId(projectId);
    }

}

