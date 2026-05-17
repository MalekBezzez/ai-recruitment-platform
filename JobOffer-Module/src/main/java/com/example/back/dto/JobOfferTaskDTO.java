package com.example.back.dto;

public record JobOfferTaskDTO(
        Long jobOfferId,
        String jobOfferName,
        String taskId,
        String taskName
) {}
