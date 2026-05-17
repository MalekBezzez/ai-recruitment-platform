package com.example.moduleleave.dto;

import java.time.LocalDate;

public class HistoryWorkflowLeaveDto {
  private Long id;
    private String taskId;
    private String taskName;
    private String decision;
    private String comment;
    private LocalDate completedAt;
    private String processInstanceId;
    private EmployeCreateDTO employee;   // remplace userId
    private Long requesterId;
    private String requesterFirstName;
    private String requesterLastName;
    private LocalDate leaveStartDate;
    private LocalDate leaveEndDate;
    private String leaveType;
    private EmployeCreateDTO manager;

    // Getter & Setter
    public EmployeCreateDTO getManager() { return manager; }
    public void setManager(EmployeCreateDTO manager) { this.manager = manager; }
    public LocalDate getLeaveStartDate() {
        return leaveStartDate;
    }

    public void setLeaveStartDate(LocalDate leaveStartDate) {
        this.leaveStartDate = leaveStartDate;
    }

    public LocalDate getLeaveEndDate() {
        return leaveEndDate;
    }

    public void setLeaveEndDate(LocalDate leaveEndDate) {
        this.leaveEndDate = leaveEndDate;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    // getters / setters
    public String getRequesterFirstName() { return requesterFirstName; }
    public void setRequesterFirstName(String requesterFirstName) {
        this.requesterFirstName = requesterFirstName;
    }
    public String getRequesterLastName() { return requesterLastName; }
    public void setRequesterLastName(String requesterLastName) {
        this.requesterLastName = requesterLastName;
    }
    public Long getRequesterId() { return requesterId; }
    public void setRequesterId(Long requesterId) { this.requesterId = requesterId; }

    public HistoryWorkflowLeaveDto() {
    }

    public HistoryWorkflowLeaveDto(Long id,
                                   String taskId,
                                   String taskName,
                                   String decision,
                                   String comment,
                                   LocalDate completedAt,
                                   String processInstanceId,
                                   EmployeCreateDTO employee) {
        this.id = id;
        this.taskId = taskId;
        this.taskName = taskName;
        this.decision = decision;
        this.comment = comment;
        this.completedAt = completedAt;
        this.processInstanceId = processInstanceId;
        this.employee = employee;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDate getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDate completedAt) {
        this.completedAt = completedAt;
    }

    public String getProcessInstanceId() {
        return processInstanceId;
    }

    public void setProcessInstanceId(String processInstanceId) {
        this.processInstanceId = processInstanceId;
    }

    public EmployeCreateDTO getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeCreateDTO employee) {
        this.employee = employee;
    }
}
