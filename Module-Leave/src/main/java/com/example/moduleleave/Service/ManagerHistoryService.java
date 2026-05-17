package com.example.moduleleave.Service;

import com.example.moduleleave.dto.ManagerTaskHistoryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ManagerHistoryService {
@Autowired
    private  RestTemplate restTemplate;

    @Value("${camunda.rest-url}")
    private String camundaRestUrl;



    public List<ManagerTaskHistoryDto> getManagerTaskHistory(String managerId) {
        List<ManagerTaskHistoryDto> result = new ArrayList<>();

        // 1) Récupère les tâches finies pour ce manager
        String taskUrl = camundaRestUrl + "/history/task?taskAssignee=" + managerId + "&finished=true";
        List<Map<String, Object>> tasks = restTemplate.exchange(
                taskUrl, HttpMethod.GET, null,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        ).getBody();
        if (tasks == null) return result;

        for (Map<String, Object> task : tasks) {
            // 2) Construire le DTO
            ManagerTaskHistoryDto dto = new ManagerTaskHistoryDto();

            // a) Dates du congé (variables de processus)
            String processInstanceId = (String) task.get("processInstanceId");
            if (processInstanceId != null) {
                List<Map<String, Object>> vars = restTemplate.exchange(
                        camundaRestUrl + "/history/variable-instance?processInstanceId=" + processInstanceId,
                        HttpMethod.GET, null,
                        new ParameterizedTypeReference<List<Map<String, Object>>>() {}
                ).getBody();

                Map<String, String> varMap = new HashMap<>();
                if (vars != null) {
                    for (Map<String, Object> v : vars) {
                        varMap.put((String)v.get("name"), String.valueOf(v.get("value")));
                    }
                }
                dto.setStartDate(varMap.getOrDefault("dateDebut", ""));
                dto.setEndDate(  varMap.getOrDefault("dateFin", ""));
                dto.setRequesterFirstName(varMap.getOrDefault("requesterFirstName", ""));
                dto.setRequesterLastName( varMap.getOrDefault("requesterLastName", ""));
                dto.setDecision(       varMap.getOrDefault("decisionManager", ""));
            }

            // b) **Date de traitement** de la tâche
            //    Camunda renvoie un champ "endTime" pour chaque historique de tâche
            Object endTime = task.get("endTime");
            dto.setProcessedAt(endTime != null ? endTime.toString() : "");

            result.add(dto);
        }

        return result;
    }

}
