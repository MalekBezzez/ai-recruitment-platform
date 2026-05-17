package com.example.moduleleave.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "History_Workflow_Leave")
public class HistoryWorkflowLeave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "History_Workflow_Leave_Id")
    private Long id;

    @Column(name = "Task_Id", length = 255)
    private String taskId;

    @Column(name = "Task_Name", length = 255)
    private String taskName;

    @Column(name = "Decision", length = 255)
    private String decision;

    @Column(name = "Comment", length = 1024)
    private String comment;

    @Column(name = "Completed_At")
    private LocalDate completedAt;

    @Column(name = "PRO_INST_Id", length = 255)
    private String processInstanceId;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "employee_id")
    private Employe employee;
    // au-dessus de @ManyToOne(fetch = FetchType.LAZY)
    @Column(name = "requester_id")
    private Long requesterId;

    /** → prénom du requester */
    @Column(name = "requester_firstname", length = 255)
    private String requesterFirstName;

    /** → nom du requester */
    @Column(name = "requester_lastname", length = 255)
    private String requesterLastName;
    private LocalDate leaveStartDate;
    private LocalDate leaveEndDate;
    private String leaveType;

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
// getters / setters…


    public String getRequesterFirstName() { return requesterFirstName; }
    public void setRequesterFirstName(String requesterFirstName) {
        this.requesterFirstName = requesterFirstName;
    }

    public String getRequesterLastName() { return requesterLastName; }
    public void setRequesterLastName(String requesterLastName) {
        this.requesterLastName = requesterLastName;
    }

    // + getter / setter
    public Long getRequesterId() { return requesterId; }
    public void setRequesterId(Long requesterId) { this.requesterId = requesterId; }

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

    public Employe getEmployee() {
        return employee;
    }

    public void setEmployee(Employe employee) {
        this.employee = employee;
    }
}