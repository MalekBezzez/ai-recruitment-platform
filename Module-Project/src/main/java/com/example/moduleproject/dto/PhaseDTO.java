package com.example.moduleproject.dto;

import java.time.LocalDate;
import java.util.List;

public class PhaseDTO {
    private Long phaseId;
    private String name;
    private String description;
    private LocalDate startedDate;
    private LocalDate endDate;
    private int totalHours;
    private Long projectId;

    // (Optionnel) Liste des tâches pour affichage côté client
    private List<TaskDTO1> tasks;

    public Long getPhaseId() {
        return phaseId;
    }

    public void setPhaseId(Long phaseId) {
        this.phaseId = phaseId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartedDate() {
        return startedDate;
    }

    public void setStartedDate(LocalDate startedDate) {
        this.startedDate = startedDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public int getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(int totalHours) {
        this.totalHours = totalHours;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public List<TaskDTO1> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskDTO1> tasks) {
        this.tasks = tasks;
    }
}
