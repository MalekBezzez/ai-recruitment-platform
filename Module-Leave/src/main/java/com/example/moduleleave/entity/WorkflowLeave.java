package com.example.moduleleave.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "workflow_leave")
public class WorkflowLeave {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "PROC_INST_ID", unique = true)
    private String processInstanceId;

    @Column(name = "STATUS_LEAVE")
    private String status;

    @OneToOne(mappedBy = "workflowLeave")
    @JsonBackReference
    private LeaveRequest leaveRequest;





    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProcessInstanceId() { return processInstanceId; }
    public void setProcessInstanceId(String processInstanceId) { this.processInstanceId = processInstanceId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LeaveRequest getLeaveRequest() { return leaveRequest; }
    public void setLeaveRequest(LeaveRequest leaveRequest) { this.leaveRequest = leaveRequest; }
}