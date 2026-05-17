package com.example.moduleleave.dto;

import lombok.Data;

@Data
public class IdentityLinkLogResponse {
    private String id;
    private String type;           // Ex: "candidate"
    private String userId;         // Peut être null si c’est un group link
    private String groupId;        // Ex: "HR"
    private String taskId;         // ID de la tâche concernée
    private String rootProcessInstanceId;
    private String operationType;  // Ex: "add"
    private String time;           // Timestamp ISO 8601
}
