package com.example.back.dto;

public record HistoryDetail(
        String id,
        String processInstanceId,
        String taskId,
        String variableName,
        String variableTypeName,
        Object value,
        String time
) {}