package com.example.back.controller;


import com.example.back.dto.*;
import com.example.back.entity.WorkflowJobOffer;
import com.example.back.Service.WorkflowOfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workflowjoboffer")
@RequiredArgsConstructor


public class WokflowOfferController {

    private final WorkflowOfferService  workflowService;

    // START WORKFLOW


    @PostMapping("/start/{offerId}")   // Done
    public ResponseEntity<WorkflowJobOffer> startWorkflow(@PathVariable Long offerId) {
        return ResponseEntity.ok(workflowService.startWorkflow(offerId));
    }

    // COMPLETE TASK
    @PostMapping("/tasks/complete")
    public ResponseEntity<Void> completeTask(
            @RequestParam String taskId,
            @RequestParam String decision,
            @RequestParam String comment,
            @RequestParam String completedBy
    ) {
        workflowService.completeUserTaskWithUpdate(taskId, decision, comment, completedBy);
        return ResponseEntity.ok().build();
    }


    // GET USER TASKS
    @GetMapping("/tasks/user/{userId}")
    public ResponseEntity<List<JobOfferTaskDTO>> getUserTasks(@PathVariable Long userId) {
        return ResponseEntity.ok(workflowService.getUserTasks(userId));
    }

    // GET USER INITIATED REQUESTS (Resume)
    @GetMapping("/requests/user/{userId}")   //Done
    public ResponseEntity<List<JobOfferRequestStateDTO>> getUserInitiatedRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(workflowService.getUserInitiatedRequests(userId));
    }

    // GET HISTORY FOR OWNER
    @GetMapping("/history/owner/{ownerId}")
    public ResponseEntity<List<OwnerTaskHistoryDTO>> getHistoryForOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(workflowService.getHistoryForOwner(ownerId));
    }


    // GET HISTORY FOR VALIDATOR
    @GetMapping("/history/validator/{validatorUserId}")
    public ResponseEntity<List<ValidatorTaskHistoryDTO>> getHistoryForValidator(@PathVariable Long validatorUserId) {
        return ResponseEntity.ok(workflowService.getHistoryForValidator(validatorUserId));
    }


    // Endpoint pour vérifier si une offre est déjà en cours de traitement
    @GetMapping("/in-process/{offerId}")
    public ResponseEntity<Map<String, Boolean>> isJobOfferInProcess(@PathVariable Long offerId) {
        boolean inProcess = workflowService.isJobOfferInProcess(offerId);
        return ResponseEntity.ok(Map.of("inProcess", inProcess));
    }


    @GetMapping("/published")
    public ResponseEntity<List<PublishedOfferDTO>> getPublishedOffers() {
        List<PublishedOfferDTO> offers = workflowService.getPublishedOffersWithStats();
        return ResponseEntity.ok(offers);
    }


}
