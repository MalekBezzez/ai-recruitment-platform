package com.example.moduleproject.dto;

public class TaskPhaseProjectDTO {
    private Long taskId;
    private Long phaseId;
    private Long projectId;

    public TaskPhaseProjectDTO(Long taskId, Long phaseId, Long projectId) {
        this.taskId = taskId;
        this.phaseId = phaseId;
        this.projectId = projectId;
    }

    // Getters et setters
    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getPhaseId() {
        return phaseId;
    }

    public void setPhaseId(Long phaseId) {
        this.phaseId = phaseId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
