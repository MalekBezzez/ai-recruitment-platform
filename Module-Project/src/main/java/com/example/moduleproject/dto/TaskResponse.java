package com.example.moduleproject.dto;



import lombok.Data;

import java.util.List;

@Data
public class TaskResponse {
    private String id;  // ID de la tâche
    private String name;  // Nom de la tâche
    private List<String> candidateGroups; // Liste des groupes candidats
    private String assignee;  // Assignee (utilisateur affecté à la tâche)
    private String processInstanceId;  // L'ID du processus auquel cette tâche appartient
    private String taskDefinitionKey;  // Clé de définition de la tâche (peut être utile pour identifier de quel type de tâche il s'agit)
    // private String ownerId;  // ID de l'owner (si disponible dans la réponse)
    // private String managerId;
    // ID du manager (si disponible dans la réponse)
    // Ajout des dates
    private String startTime;  // format ISO 8601 avec offset
    private String endTime;
    private String taskState; // "Completed" ou "Created"

    // D'autres champs peuvent être ajoutés selon la réponse de Camunda
}
