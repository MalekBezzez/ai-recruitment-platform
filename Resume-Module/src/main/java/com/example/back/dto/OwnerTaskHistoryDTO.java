package com.example.back.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record OwnerTaskHistoryDTO(
        String processInstanceId,
        String taskName,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm")
        LocalDateTime startTime,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm")
        LocalDateTime endTime,
        String jobTitle,
        String decision,
        String comment,
        String completedByName
) {}