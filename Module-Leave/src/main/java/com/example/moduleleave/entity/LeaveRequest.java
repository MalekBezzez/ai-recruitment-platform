package com.example.moduleleave.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;


import java.time.LocalDate;
@Entity
@Table(name = "leave_request")
public class LeaveRequest {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leave_type")
    private LeaveType leaveType;

    @Column(length = 500)
    private String description;


    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "number_of_hours")
    private Double numberOfHours;


    private String status;


    private LocalDate requestDate;

    @Column(name = "approver_id", nullable = true)
    private Long approverId;

    public Double getNumberOfHours() {
        return numberOfHours;
    }

    public void setNumberOfHours(Double numberOfHours) {
        this.numberOfHours = numberOfHours;
    }


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = true)
    @JsonBackReference("employee-leaveRequests")
    private Employe employee;
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "workflow_leave_id")
    private WorkflowLeave workflowLeave;



    public String getStatus() {
        return status;
    }

    public WorkflowLeave getWorkflowLeave() {
        return workflowLeave;
    }

    public void setWorkflowLeave(WorkflowLeave workflowLeave) {
        this.workflowLeave = workflowLeave;
    }

    // Getters
    public Long getId() {
        return id;
    }
    public Long getApproverId() {
        return approverId;
    }

    public void setApproverId(Long approverId) {
        this.approverId = approverId;
    }
    public void setStatus(String status) {
        this.status = status;
    }

  /*  public String getLeaveType() {
        return leaveType;
    }*/

    public String getDescription() {
        return description;
    }


    public Employe getEmployee() {
        return employee;
    }

    public void setEmployee(Employe employee) {
        this.employee = employee;
    }


    public LocalDate getRequestDate() {
        return requestDate;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

  /*  public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }*/

    public void setDescription(String description) {
        this.description = description;
    }


    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }


}