package com.example.moduleleave.Service;

import com.example.moduleleave.Repository.WorkflowLeaveRepository;
import com.example.moduleleave.entity.LeaveRequest;
import com.example.moduleleave.entity.WorkflowLeave;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkflowLeaveService {

    private final WorkflowLeaveRepository workflowRepository;
    private final LeaveRequestService leaveRequestService;

    public WorkflowLeaveService(WorkflowLeaveRepository workflowRepository,
                                LeaveRequestService leaveRequestService) {
        this.workflowRepository = workflowRepository;
        this.leaveRequestService = leaveRequestService;
    }
    @Transactional
    public void updateWorkflowStatusByLeaveRequest(Long leaveRequestId, String newStatus) {
        WorkflowLeave wf = workflowRepository
                .findByLeaveRequestId(leaveRequestId)
                .orElseThrow(() -> new RuntimeException("Workflow not found for leaveRequest " + leaveRequestId));
        wf.setStatus(newStatus);
        workflowRepository.save(wf);
    }
    @Transactional
    public WorkflowLeave createWorkflow(Long leaveRequestId, String processInstanceId) {
        LeaveRequest request = leaveRequestService.getLeaveRequestById(leaveRequestId);

        WorkflowLeave workflow = new WorkflowLeave();
        workflow.setProcessInstanceId(processInstanceId);
        workflow.setStatus("created");
        workflow.setLeaveRequest(request);

        return workflowRepository.save(workflow);
    }


    /** Retourne null si pas trouvé, plutôt que d’exceptionner */
    public WorkflowLeave findWorkflowByLeaveRequest(Long leaveRequestId) {
        return workflowRepository.findByLeaveRequestId(leaveRequestId)
                .orElse(null);
    }

    public WorkflowLeave updateStatus(String processInstanceId, String newStatus) {
        WorkflowLeave workflow = workflowRepository.findByProcessInstanceId(processInstanceId)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));
        workflow.setStatus(newStatus);
        return workflowRepository.save(workflow);
    }


    public WorkflowLeave getWorkflowByLeaveRequest(Long leaveRequestId) {
        return workflowRepository.findByLeaveRequestId(leaveRequestId)
                .orElseThrow(() -> new RuntimeException("Workflow not found for this request"));
    }
    public void updateWorkflow(WorkflowLeave workflowLeave) {
        workflowRepository.save(workflowLeave);
    }
    public WorkflowLeave findByProcessInstanceId(String processInstanceId) {
        return workflowRepository.findByProcessInstanceId(processInstanceId)
                .orElse(null);  // ou lever une exception selon votre choix
    }
}