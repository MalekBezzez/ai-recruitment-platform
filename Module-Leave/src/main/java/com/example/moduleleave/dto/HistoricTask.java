package com.example.moduleleave.dto;

import java.time.OffsetDateTime;

public record HistoricTask(
        String id,
        String name,
        String assignee,
        OffsetDateTime startTime,
        OffsetDateTime endTime,
        String processInstanceId,
        String taskDefinitionKey
) {}