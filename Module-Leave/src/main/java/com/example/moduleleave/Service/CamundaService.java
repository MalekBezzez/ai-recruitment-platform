package com.example.moduleleave.Service;

import com.example.moduleleave.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CamundaService {

    private final RestTemplate restTemplate;

    @Value("${camunda.rest-url}")
    private String camundaRestUrl;

    public String startProcessInstance(String processKey, Map<String, Object> variables) {
        String url = camundaRestUrl + "/process-definition/key/" + processKey + "/start";
        Map<String, Object> requestBody = new HashMap<>();
        if (variables != null && !variables.isEmpty()) {
            Map<String, Object> camundaVars = new HashMap<>();
            for (Map.Entry<String, Object> entry : variables.entrySet()) {
                camundaVars.put(entry.getKey(), Map.of("value", entry.getValue(), "type", "String"));
            }
            requestBody.put("variables", camundaVars);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        return (String) response.getBody().get("id");
    }

    public void setProcessVariables(String taskId, Map<String, Object> variables) {
        String url = camundaRestUrl + "/task/" + taskId + "/variables";
        Map<String, Object> formattedVariables = new HashMap<>();
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            Map<String, Object> variableMap = new HashMap<>();
            variableMap.put("value", entry.getValue());
            variableMap.put("type", "String");
            formattedVariables.put(entry.getKey(), variableMap);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(formattedVariables, headers);
        restTemplate.postForEntity(url, entity, Void.class);
    }

    public void completeTask(String taskId, Map<String, Object> variables) {
        String url = camundaRestUrl + "/task/" + taskId + "/complete";
        Map<String, Object> requestBody = new HashMap<>();
        if (variables != null && !variables.isEmpty()) {
            Map<String, Object> camundaVars = new HashMap<>();
            for (Map.Entry<String, Object> entry : variables.entrySet()) {
                camundaVars.put(entry.getKey(), Map.of("value", entry.getValue(), "type", "String"));
            }
            requestBody.put("variables", camundaVars);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        restTemplate.postForEntity(url, entity, Void.class);
    }

    public void setGlobalVariables(String taskId, Map<String, Object> variables) {
        String url = camundaRestUrl + "/task/" + taskId + "/variables";
        Map<String, Object> formattedVariables = new HashMap<>();
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            Map<String, Object> variableMap = new HashMap<>();
            variableMap.put("value", entry.getValue());
            variableMap.put("type", "String");
            formattedVariables.put(entry.getKey(), variableMap);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(formattedVariables, headers);
        restTemplate.postForEntity(url, entity, Void.class);
    }

    public void setLocalVariables(String taskId, Map<String, Object> variables) {
        String url = camundaRestUrl + "/task/" + taskId + "/localVariables";
        Map<String, Object> formattedVariables = new HashMap<>();
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            Map<String, Object> variableMap = new HashMap<>();
            variableMap.put("value", entry.getValue());
            variableMap.put("type", "String");
            formattedVariables.put(entry.getKey(), variableMap);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(formattedVariables, headers);
        restTemplate.postForEntity(url, entity, Void.class);
        System.out.print("sent successfully ***********");
    }

    public List<TaskResponse> getTasksAssignedToUser(String userId) {
        String url = camundaRestUrl + "/task?assignee=" + userId;
        ResponseEntity<TaskResponse[]> response = restTemplate.getForEntity(url, TaskResponse[].class);
        return Arrays.asList(response.getBody());
    }

    public List<TaskResponse> getTasksByCandidateGroup(String group) {
        String url = camundaRestUrl + "/task?candidateGroup=" + group;
        ResponseEntity<TaskResponse[]> response = restTemplate.getForEntity(url, TaskResponse[].class);
        return Arrays.asList(response.getBody());
    }

    public String getProcessInstanceIdByTaskId(String taskId) {
        String url = camundaRestUrl + "/task/" + taskId;
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        Map<String, Object> body = response.getBody();
        return (String) body.get("processInstanceId");
    }

    public List<TaskResponse> getAllTasks() {
        String url = camundaRestUrl + "/task";
        try {
            ResponseEntity<TaskResponse[]> response = restTemplate.getForEntity(url, TaskResponse[].class);
            TaskResponse[] tasksArray = response.getBody();
            return tasksArray != null ? List.of(tasksArray) : new ArrayList<>();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public Map<String, Object> getProcessVariables(String processInstanceId) {
        String url = camundaRestUrl + "/process-instance/" + processInstanceId + "/variables";
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        return response.getBody();
    }

    public String getCurrentActiveTaskName(String processInstanceId) {
        String url = camundaRestUrl + "/task?processInstanceId=" + processInstanceId;
        ResponseEntity<TaskResponse[]> response = restTemplate.getForEntity(url, TaskResponse[].class);
        TaskResponse[] tasks = response.getBody();
        return (tasks != null && tasks.length > 0) ? tasks[0].getName() : "Terminé";
    }

    public String getPreviousCommentFromProcessVariables(String processInstanceId) {
        String url = camundaRestUrl + "/process-instance/" + processInstanceId + "/variables";
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        Map<String, Object> variables = response.getBody();
        if (variables != null && variables.containsKey("Comment")) {
            Map<String, Object> commentMap = (Map<String, Object>) variables.get("Comment");
            return (String) commentMap.get("value");
        }
        return "";
    }

    public List<HistoryDetail> getHistoryByProcessInstances(List<String> processInstanceIds) {
        List<HistoryDetail> allDetails = new ArrayList<>();
        for (String processInstanceId : processInstanceIds) {
            String url = camundaRestUrl + "/history/detail?processInstanceId=" + processInstanceId + "&type=variableUpdate";
            ResponseEntity<HistoryDetail[]> response = restTemplate.getForEntity(url, HistoryDetail[].class);
            if (response.getBody() != null) {
                allDetails.addAll(Arrays.asList(response.getBody()));
            }
        }
        return allDetails;
    }

    public HistoricTask getHistoricTask(String taskId) {
        String url = camundaRestUrl + "/history/task/" + taskId;
        ResponseEntity<HistoricTask> response = restTemplate.getForEntity(url, HistoricTask.class);
        return response.getBody();
    }

    public List<HistoryDetail> getHistoryByCompletedBy(String userId) {
        String url = camundaRestUrl + "/history/detail?processVariables=CompletedBy_eq_" + userId + "&type=variableUpdate";
        ResponseEntity<HistoryDetail[]> response = restTemplate.getForEntity(url, HistoryDetail[].class);
        return response.getBody() != null ? Arrays.asList(response.getBody()) : Collections.emptyList();
    }

    public List<HistoryDetail> getHistoryDetailsByTaskId(String taskId) {
        String url = camundaRestUrl + "/history/detail?taskId=" + taskId + "&type=variableUpdate";
        ResponseEntity<HistoryDetail[]> response = restTemplate.getForEntity(url, HistoryDetail[].class);
        return response.getBody() != null ? Arrays.asList(response.getBody()) : Collections.emptyList();
    }

    public TaskResponse getTaskById(String taskId) {
        String url = camundaRestUrl + "/task/" + taskId;
        try {
            ResponseEntity<TaskResponse> response = restTemplate.getForEntity(url, TaskResponse.class);
            return response.getBody();
        } catch (RestClientException e) {
            throw new RuntimeException("Erreur lors de la récupération de la tâche avec l'ID : " + taskId, e);
        }
    }

    public List<TaskResponse> getTasksByAssignee(String userId) {
        String url = camundaRestUrl + "/history/task?assignee=" + userId + "&finished=true";
        try {
            ResponseEntity<TaskResponse[]> response = restTemplate.getForEntity(url, TaskResponse[].class);
            TaskResponse[] tasks = response.getBody();
            return tasks != null ? Arrays.asList(tasks) : Collections.emptyList();
        } catch (RestClientException e) {
            throw new RuntimeException("Erreur lors de la récupération des tâches assignées à l'utilisateur : " + userId, e);
        }
    }

    public List<TaskResponse> getHistoricTasksAssignedTo(String userId) {
        String url = camundaRestUrl + "/history/task?assignee=" + userId + "&finished=true";
        ResponseEntity<TaskResponse[]> response = restTemplate.getForEntity(url, TaskResponse[].class);
        return response.getBody() != null ? Arrays.asList(response.getBody()) : new ArrayList<>();
    }

    public List<IdentityLinkLogResponse> getHistoricIdentityLinksByGroup(String groupId) {
        String url = camundaRestUrl + "/history/identity-link-log?type=candidate&groupId=" + groupId;
        ResponseEntity<IdentityLinkLogResponse[]> response = restTemplate.getForEntity(url, IdentityLinkLogResponse[].class);
        return response.getBody() != null ? Arrays.asList(response.getBody()) : new ArrayList<>();
    }

    public Optional<TaskResponse> getHistoricTaskById(String taskId) {
        String url = camundaRestUrl + "/history/task/" + taskId;
        try {
            ResponseEntity<TaskResponse> response = restTemplate.getForEntity(url, TaskResponse.class);
            return Optional.ofNullable(response.getBody());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public String getHistoricVariable(String processInstanceId, String variableName) {
        String url = camundaRestUrl + "/history/variable-instance?processInstanceId=" + processInstanceId + "&variableName=" + variableName;
        try {
            ResponseEntity<CamundaVariableResponse[]> response = restTemplate.getForEntity(url, CamundaVariableResponse[].class);
            if (response.getBody() != null && response.getBody().length > 0) {
                return response.getBody()[0].getValue();
            }
        } catch (Exception e) {
            // Log or ignore
        }
        return null;
    }

    public boolean isProcessInstanceEnded(String processInstanceId) {
        String url = camundaRestUrl + "/history/process-instance/" + processInstanceId;
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object endTime = response.getBody().get("endTime");
                return endTime != null;
            }
        } catch (HttpClientErrorException.NotFound e) {
            return true;
        }
        return false;
    }
}
