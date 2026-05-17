package com.example.moduleleave.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Imputation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imputationId;

    private LocalDate date;
    private int hours;
    private LocalTime startedTime;
    private LocalTime endTime;
    private int totalHours;

    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Employe employee;

    @Column(name = "task_id")
    private Long taskId;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "validee")
    private boolean validee = false;

    @Column(name = "payslip_id")
    private Long payslipId;

    @Column(name = "is_draft")
    private boolean isDraft = true;

    // getters and setters

    public Long getImputationId() {
        return imputationId;
    }

    public void setImputationId(Long imputationId) {
        this.imputationId = imputationId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getHours() {
        return hours;
    }

    public void setHours(int hours) {
        this.hours = hours;
    }

    public LocalTime getStartedTime() {
        return startedTime;
    }

    public void setStartedTime(LocalTime startedTime) {
        this.startedTime = startedTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public int getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(int totalHours) {
        this.totalHours = totalHours;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Employe getEmployee() {
        return employee;
    }

    public void setEmployee(Employe employee) {
        this.employee = employee;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public boolean isValidee() {
        return validee;
    }

    public void setValidee(boolean validee) {
        this.validee = validee;
    }

    public Long getPayslipId() {
        return payslipId;
    }

    public void setPayslipId(Long payslipId) {
        this.payslipId = payslipId;
    }

    public boolean isDraft() {
        return isDraft;
    }

    public void setDraft(boolean isDraft) {
        this.isDraft = isDraft;
    }

    @Override
    public String toString() {
        return "Imputation{" +
                "imputationId=" + imputationId +
                ", date=" + date +
                ", hours=" + hours +
                ", startedTime=" + startedTime +
                ", endTime=" + endTime +
                ", totalHours=" + totalHours +
                ", description='" + description + '\'' +
                ", validee=" + validee +
                ", isDraft=" + isDraft +
                ", employee=" + (employee != null ? employee.getId() : "null") +
                ", taskId=" + taskId +
                ", projectId=" + projectId +
                ", payslipId=" + payslipId +
                '}';
    }
}
