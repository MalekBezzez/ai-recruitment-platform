package com.example.back.dto;

public record UserWorkflowStatusDTO(
        String processInstanceId,
        String currentTaskName,
        String previousTaskName,
        String jobOfferName,
        String status // par ex. "En cours", "En attente", etc.
) {}
