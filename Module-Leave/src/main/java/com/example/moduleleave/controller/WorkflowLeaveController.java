package com.example.moduleleave.controller;

import com.example.moduleleave.Service.WorkflowLeaveService;
import com.example.moduleleave.entity.WorkflowLeave;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowLeaveController {

    private final WorkflowLeaveService workflowService;

    public WorkflowLeaveController(WorkflowLeaveService workflowService) {
        this.workflowService = workflowService;
    }

    @PostMapping("/{leaveRequestId}")
    public ResponseEntity<WorkflowLeave> startWorkflow(
            @PathVariable Long leaveRequestId,
            @RequestParam String processInstanceId) {

        WorkflowLeave workflow = workflowService.createWorkflow(leaveRequestId, processInstanceId);
        return new ResponseEntity<>(workflow, HttpStatus.CREATED);
    }

    @PatchMapping("/{processInstanceId}/status")
    public ResponseEntity<WorkflowLeave> updateWorkflowStatus(
            @PathVariable String processInstanceId,
            @RequestParam String status) {

        WorkflowLeave updated = workflowService.updateStatus(processInstanceId, status);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/leave-requests/{leaveRequestId}")
    public ResponseEntity<WorkflowLeave> getByLeaveRequest(
            @PathVariable Long leaveRequestId) {

        return ResponseEntity.ok(workflowService.getWorkflowByLeaveRequest(leaveRequestId));
    }
}
