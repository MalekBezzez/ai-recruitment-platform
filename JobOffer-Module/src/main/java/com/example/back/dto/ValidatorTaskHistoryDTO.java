package com.example.back.dto;

import java.time.LocalDateTime;
// LocalDateTime startTime,  Before
public record ValidatorTaskHistoryDTO(
        String processInstanceId,
        String taskId,
        String taskName,
        String startTime,
        String endTime,
        String jobOfferName,
        String ownerName,
        String decision,
        String comment
) {}