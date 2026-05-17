package com.example.moduleleave.dto;

public record HistoryDetail(
        String id,
        String processInstanceId,
        String taskId,
        String variableName,
        String variableTypeName,
        Object value,
        String time
) {}