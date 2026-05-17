package com.example.modulepayslip.dto;



import java.time.LocalDate;
import java.time.LocalTime;

public class ImputationDTO {
    private Long imputationId;
    private LocalDate date;
    private int hours;
    private LocalTime startedTime;
    private LocalTime endTime;
    private int totalHours;
    private String description;
    private Long userId;
    private Long taskId; // This should be nullable
    private Long projectId;
    private boolean valide;
    private boolean draft;
    private Long payslipId;

    // Getters and setters
    public Long getImputationId() { return imputationId; }
    public void setImputationId(Long imputationId) { this.imputationId = imputationId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public int getHours() { return hours; }
    public void setHours(int hours) { this.hours = hours; }
    public LocalTime getStartedTime() { return startedTime; }
    public void setStartedTime(LocalTime startedTime) { this.startedTime = startedTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public int getTotalHours() { return totalHours; }
    public void setTotalHours(int totalHours) { this.totalHours = totalHours; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public boolean isValide() { return valide; }
    public void setValide(boolean validee) { this.valide = validee; }
    public boolean isDraft() { return draft; }
    public void setDraft(boolean draft) { this.draft = draft; }
    public Long getPayslipId() { return payslipId; }
    public void setPayslipId(Long payslipId) { this.payslipId = payslipId; }
}