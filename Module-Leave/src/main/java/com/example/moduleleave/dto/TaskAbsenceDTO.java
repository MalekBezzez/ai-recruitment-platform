package com.example.moduleleave.dto;

public class TaskAbsenceDTO {
    private Long taskId;
    private String name;
    private String description;

    // Constructeurs
    public TaskAbsenceDTO() {}

    public TaskAbsenceDTO(Long taskId, String name, String description) {
        this.taskId = taskId;
        this.name = name;
        this.description = description;
    }

    // Getters et Setters
    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
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
}