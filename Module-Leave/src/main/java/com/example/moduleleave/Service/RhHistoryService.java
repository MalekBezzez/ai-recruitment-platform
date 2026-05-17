package com.example.moduleleave.Service;



import com.example.moduleleave.dto.HistoricTaskResponse;
import com.example.moduleleave.dto.HistoricVariableInstance;
import com.example.moduleleave.dto.RhTaskHistoryDto;
import com.example.moduleleave.dto.ValidationHistoryDTO;
import com.example.moduleleave.entity.Employe;
import com.example.moduleleave.entity.LeaveRequest;
import com.example.moduleleave.exception.LeaveRequestNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class RhHistoryService {
    @Autowired
    private RestTemplate restTemplate;

    @Value("${camunda.rest-url}")
    private String camundaRestUrl;
    @Autowired
    LeaveRequestService leaveRequestService;


    public List<ValidationHistoryDTO> getCompletedTasksFiltered(
            List<String> taskKeys,
            String decisionVariableName
    ) {
        List<ValidationHistoryDTO> result = new ArrayList<>();

        if (taskKeys == null || taskKeys.isEmpty()) return result;

        // Build taskDefinitionKeyIn=UserTask1,UserTask2
        String joinedKeys = String.join(",", taskKeys);

        String url = camundaRestUrl + "/history/task"
                + "?finished=true"
                + "&taskDefinitionKeyIn=" + joinedKeys;

        HistoricTaskResponse[] allTasks = restTemplate.getForObject(url, HistoricTaskResponse[].class);
        if (allTasks == null || allTasks.length == 0) return result;

        Map<String, HistoricTaskResponse> lastByInstance = new LinkedHashMap<>();
        for (HistoricTaskResponse ht : allTasks) {
            lastByInstance.putIfAbsent(ht.getProcessInstanceId(), ht);
        }

        for (HistoricTaskResponse ht : lastByInstance.values()) {
            String pid = ht.getProcessInstanceId();

            // a) Get leaveRequestId
            String varLeaveUrl = camundaRestUrl
                    + "/history/variable-instance"
                    + "?processInstanceId=" + pid
                    + "&variableName=leaveRequestId";
            HistoricVariableInstance[] leaveVars = restTemplate.getForObject(varLeaveUrl, HistoricVariableInstance[].class);
            if (leaveVars == null || leaveVars.length == 0 || leaveVars[0].getValue() == null) continue;
            Long lrId = Long.valueOf(leaveVars[0].getValue().toString());

            // b) Get decision
            String varDecUrl = camundaRestUrl
                    + "/history/variable-instance"
                    + "?processInstanceId=" + pid
                    + "&variableName=" + decisionVariableName;
            HistoricVariableInstance[] decVars = restTemplate.getForObject(varDecUrl, HistoricVariableInstance[].class);
            String decision = (decVars != null && decVars.length > 0 && decVars[0].getValue() != null)
                    ? decVars[0].getValue().toString()
                    : "UNKNOWN";

            // c) Load leaveRequest + employé
            LeaveRequest lr;
            try {
                lr = leaveRequestService.getLeaveRequestById(lrId);
            } catch (LeaveRequestNotFoundException e) {
                continue;
            }
            Employe emp = lr.getEmployee();

            // d) Construct DTO
            ValidationHistoryDTO dto = new ValidationHistoryDTO();
            dto.setTaskDefinitionKey(ht.getTaskDefinitionKey());
            dto.setName(ht.getName());
            dto.setRequesterId(emp.getId());
            dto.setRequesterName(emp.getFirstname() + " " + emp.getLastname());
            dto.setStartDate(lr.getStartDate());
            dto.setEndDate(lr.getEndDate());
            dto.setEndTime(ht.getEndTime());
            dto.setDecision(decision);
            dto.setAssignee(ht.getAssignee());
            dto.setType(lr.getLeaveType() != null ? lr.getLeaveType().getType() : "—");

            result.add(dto);
        }

        return result;
    }

}