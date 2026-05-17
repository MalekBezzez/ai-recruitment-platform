package com.example.back.Service;


import com.example.back.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CamundaService {

    private final RestTemplate restTemplate ;



    public String startProcessInstance(String processKey, Map<String, Object> variables) {
        String url = "http://camunda:8080/engine-rest/process-definition/key/" + processKey + "/start";

        // Construction du corps de la requête
        Map<String, Object> requestBody = new HashMap<>();
        if (variables != null && !variables.isEmpty()) {
            Map<String, Object> camundaVars = new HashMap<>();
            for (Map.Entry<String, Object> entry : variables.entrySet()) {
                camundaVars.put(entry.getKey(), Map.of("value", entry.getValue(), "type", "String"));
                //"orderId" -> {"value": 123, "type": "String"}
            }
            requestBody.put("variables", camundaVars);
            // Entré {
            //  "customerId": "cust-789",
            //  "amount": 1500.0
            //}
            //   sortie
            // Exemple {
            //  "variables": {
            //    "orderId": {"value": 123, "type": "String"},
            //    "priority": {"value": "high", "type": "String"}
            //  }
            //}
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        // Récupère l'ID de l'instance
        return (String) response.getBody().get("id");
    }

    //Send Process Variables
    public void setProcessVariables(String taskId, Map<String, Object> variables) {
        String url = "http://camunda:8080/engine-rest/task/" + taskId + "/variables";

        // Préparation du corps de la requête au format attendu par Camunda
        Map<String, Object> formattedVariables = new HashMap<>();
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            Map<String, Object> variableMap = new HashMap<>();
            variableMap.put("value", entry.getValue());
            variableMap.put("type", "String"); // Vous pouvez adapter dynamiquement si besoin
            formattedVariables.put(entry.getKey(), variableMap);
        }

        // Configuration des headers et envoi de la requête
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(formattedVariables, headers);

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.postForEntity(url, entity, Void.class);
    }

    // Update the existing process variables
    public void completeTask(String taskId, Map<String, Object> variables) {
        String url = "http://camunda:8080/engine-rest/task/" + taskId + "/complete";

        Map<String, Object> requestBody = new HashMap<>();
        if (variables != null && !variables.isEmpty()) {
            Map<String, Object> camundaVars = new HashMap<>();
            for (Map.Entry<String, Object> entry : variables.entrySet()) {
                camundaVars.put(entry.getKey(), Map.of(
                        "value", entry.getValue(),
                        "type", "String"
                ));
            }
            requestBody.put("variables", camundaVars);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        restTemplate.postForEntity(url, entity, Void.class);
    }


    //Send global variables

    public void setGlobalVariables(String taskId, Map<String, Object> variables) {
        String url = "http://camunda:8080/engine-rest/task/" + taskId + "/variables";

        // Formater les variables au format Camunda
        Map<String, Object> camundaFormattedVariables = new HashMap<>();
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            Map<String, Object> variableMap = new HashMap<>();
            variableMap.put("value", entry.getValue());
            variableMap.put("type", "String"); // Adapter selon besoin
            camundaFormattedVariables.put(entry.getKey(), variableMap);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(camundaFormattedVariables, headers);

        restTemplate.postForEntity(url, entity, Void.class);
    }


    //Send local variables
    //Ajout de variables locales à une tâche
    public void setLocalVariables(String taskId, Map<String, Object> variables) {
        String url = "http://camunda:8080/engine-rest/task/" + taskId + "/localVariables";

        // Formater manuellement les variables pour Camunda REST
        Map<String, Object> camundaFormattedVariables = new HashMap<>();
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            Map<String, Object> variableMap = new HashMap<>();
            variableMap.put("value", entry.getValue());
            variableMap.put("type", "String"); // Adapter si besoin
            camundaFormattedVariables.put(entry.getKey(), variableMap);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(camundaFormattedVariables, headers);

        restTemplate.postForEntity(url, entity, Void.class);
        System.out.print("sent successfully ***********");

    }



    public List<TaskResponse> getTasksAssignedToUser(String userId) {
        String url = "http://camunda:8080/engine-rest" + "/task?assignee=" + userId;
        ResponseEntity<TaskResponse[]> response = restTemplate.getForEntity(url, TaskResponse[].class);
        return Arrays.asList(response.getBody());
    }


    public List<TaskResponse> getTasksByCandidateGroup(String group) {
        String url = "http://camunda:8080/engine-rest" + "/task?candidateGroup=" + group;
        ResponseEntity<TaskResponse[]> response = restTemplate.getForEntity(url, TaskResponse[].class);
        return Arrays.asList(response.getBody());
    }






    public String getProcessInstanceIdByTaskId(String taskId) {
        String url = "http://camunda:8080/engine-rest/task/" + taskId;
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        Map<String, Object> body = response.getBody();
        return (String) body.get("processInstanceId");
    }


    public List<TaskResponse> getAllTasks() {
        String url = "http://camunda:8080/engine-rest/task";  // URL de l'API Camunda pour récupérer toutes les tâches

        try {
            // Appel API et récupération des tâches sous forme de tableau de TaskResponse
            ResponseEntity<TaskResponse[]> responseEntity = restTemplate.getForEntity(url, TaskResponse[].class);

            // Vérifier si le corps de la réponse n'est pas nul
            TaskResponse[] tasksArray = responseEntity.getBody();

            // Si le tableau de tâches n'est pas nul et qu'il contient des tâches, on le convertit en liste et on le retourne
            if (tasksArray != null && tasksArray.length > 0) {
                return List.of(tasksArray);  // Retourne la liste des tâches
            } else {
                return new ArrayList<>();  // Si aucune tâche, retourne une liste vide
            }
        } catch (Exception e) {
            // Gestion des erreurs, au cas où l'API Camunda retourne une erreur ou s'il y a un problème de connexion
            e.printStackTrace();
            return new ArrayList<>();  // Retourne une liste vide en cas d'erreur
        }
    }


    public Map<String, Object> getProcessVariables(String processInstanceId) {
        String url = "http://camunda:8080/engine-rest/process-instance/" + processInstanceId + "/variables";

        // Appel API pour récupérer les variables du processus
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

        // Retourner les variables du processus
        return response.getBody();
    }

    public String getCurrentActiveTaskName(String processInstanceId) {
        String url = "http://camunda:8080/engine-rest/task?processInstanceId=" + processInstanceId;
        ResponseEntity<TaskResponse[]> response = restTemplate.getForEntity(url, TaskResponse[].class);

        TaskResponse[] tasks = response.getBody();

        if (tasks != null && tasks.length > 0) {
            return tasks[0].getName(); // normalement une seule tâche active par process
        } else {
            return "Terminé"; // Peut arriver si le processus vient juste de se terminer
        }
    }

    public String getPreviousCommentFromProcessVariables(String processInstanceId) {
        String url = "http://camunda:8080/engine-rest/process-instance/" + processInstanceId + "/variables";

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        Map<String, Object> variables = response.getBody();

        if (variables != null && variables.containsKey("Comment")) {
            Map<String, Object> commentMap = (Map<String, Object>) variables.get("Comment");
            return (String) commentMap.get("value");
        }
        return ""; // par défaut, pas de commentaire
    }

    public List<HistoryDetail> getHistoryByProcessInstances(List<String> processInstanceIds) {
        List<HistoryDetail> allDetails = new ArrayList<>();

        for (String processInstanceId : processInstanceIds) {
            String url = "http://camunda:8080/engine-rest/history/detail" +
                    "?processInstanceId=" + processInstanceId +
                    "&type=variableUpdate"; // <-- Filtre uniquement les mises à jour de variables

            ResponseEntity<HistoryDetail[]> response = restTemplate.getForEntity(url, HistoryDetail[].class);

            if (response.getBody() != null) {
                allDetails.addAll(Arrays.asList(response.getBody()));
            }
        }

        return allDetails;
    }

    public HistoricTask getHistoricTask(String taskId) {
        String url = "http://camunda:8080/engine-rest/history/task/" + taskId;
        ResponseEntity<HistoricTask> response = restTemplate.getForEntity(url, HistoricTask.class);
        return response.getBody();
    }



    public List<HistoryDetail> getHistoryByCompletedBy(String userId) {
        String url = "http://camunda:8080/engine-rest/history/detail" +
                "?processVariables=CompletedBy_eq_" + userId +
                "&type=variableUpdate";
        ResponseEntity<HistoryDetail[]> response = restTemplate.getForEntity(url, HistoryDetail[].class);

        if (response.getBody() != null) {
            return Arrays.asList(response.getBody());
        } else {
            return Collections.emptyList();
        }
    }


    public List<HistoryDetail> getHistoryDetailsByTaskId(String taskId) {
        String url = "http://camunda:8080/engine-rest/history/detail?taskId=" + taskId + "&type=variableUpdate";

        ResponseEntity<HistoryDetail[]> response = restTemplate.getForEntity(url, HistoryDetail[].class);

        if (response.getBody() != null) {
            return Arrays.asList(response.getBody());
        } else {
            return Collections.emptyList();
        }
    }


    public TaskResponse getTaskById(String taskId) {
        String url = "http://camunda:8080/engine-rest/task/" + taskId;

        try {
            ResponseEntity<TaskResponse> response = restTemplate.getForEntity(url, TaskResponse.class);
            return response.getBody();
        } catch (RestClientException e) {
            throw new RuntimeException("Erreur lors de la récupération de la tâche avec l'ID : " + taskId, e);
        }
    }

    public List<TaskResponse> getTasksByAssignee(String userId) {
        String url ="http://camunda:8080/engine-rest/history/task?assignee=" + userId + "&finished=true";  // finished=true pour tâches terminées

        try {
            ResponseEntity<TaskResponse[]> response = restTemplate.getForEntity(url, TaskResponse[].class);
            TaskResponse[] tasks = response.getBody();
            return tasks != null ? Arrays.asList(tasks) : Collections.emptyList();
        } catch (RestClientException e) {
            throw new RuntimeException("Erreur lors de la récupération des tâches assignées à l'utilisateur : " + userId, e);
        }
    }

    public List<TaskResponse> getHistoricTasksAssignedTo(String userId) {
        String url = "http://camunda:8080/engine-rest/history/task?assignee=" + userId + "&finished=true";
        ResponseEntity<TaskResponse[]> response = restTemplate.getForEntity(url, TaskResponse[].class);
        return response.getBody() != null ? Arrays.asList(response.getBody()) : new ArrayList<>();
    }

    public List<IdentityLinkLogResponse> getHistoricIdentityLinksByGroup(String groupId) {
        String url = "http://camunda:8080/engine-rest/history/identity-link-log?type=candidate&groupId=" + groupId;
        ResponseEntity<IdentityLinkLogResponse[]> response = restTemplate.getForEntity(url, IdentityLinkLogResponse[].class);
        return response.getBody() != null ? Arrays.asList(response.getBody()) : new ArrayList<>();
    }

    public Optional<TaskResponse> getHistoricTaskById(String taskId) {
        String url = "http://camunda:8080/engine-rest/history/task/" + taskId;
        try {
            ResponseEntity<TaskResponse> response = restTemplate.getForEntity(url, TaskResponse.class);
            return Optional.ofNullable(response.getBody());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public String getHistoricVariable(String processInstanceId, String variableName) {
        String url = "http://camunda:8080/engine-rest/history/variable-instance"
                + "?processInstanceId=" + processInstanceId
                + "&variableName=" + variableName;

        try {
            ResponseEntity<CamundaVariableResponse[]> response = restTemplate.getForEntity(url, CamundaVariableResponse[].class);
            if (response.getBody() != null && response.getBody().length > 0) {
                return response.getBody()[0].getValue();
            }
        } catch (Exception e) {
            // Log error if needed
        }
        return null;
    }

    public boolean isProcessInstanceEnded(String processInstanceId) {
        String url = "http://camunda:8080/engine-rest/history/process-instance/" + processInstanceId;
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object endTime = response.getBody().get("endTime");
                return endTime != null;
            }
        } catch (HttpClientErrorException.NotFound e) {
            // Process non trouvé → on considère terminé
            return true;
        }
        return false;
    }


}
