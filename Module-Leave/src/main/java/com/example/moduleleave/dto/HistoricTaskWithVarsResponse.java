package com.example.moduleleave.dto;

import java.util.Date;
import java.util.Map;

public class HistoricTaskWithVarsResponse {
    private String id;
    private String taskDefinitionKey;
    private String name;
    private String assignee;
    private Map<String, HistoricVariableInstance> processVariables;
    private Date   startTime;
    private Date endTime;
    // --> nouvelle ligne


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTaskDefinitionKey() {
        return taskDefinitionKey;
    }

    public void setTaskDefinitionKey(String taskDefinitionKey) {
        this.taskDefinitionKey = taskDefinitionKey;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Map<String, HistoricVariableInstance> getProcessVariables() {
        return processVariables;
    }

    public void setProcessVariables(Map<String, HistoricVariableInstance> processVariables) {
        this.processVariables = processVariables;
    }
}
