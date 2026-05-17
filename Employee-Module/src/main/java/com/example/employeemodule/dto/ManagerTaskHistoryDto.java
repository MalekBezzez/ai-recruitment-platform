package com.example.employeemodule.dto;



import lombok.Data;

@Data
public class ManagerTaskHistoryDto {
    private String startDate;
    private String endDate;
    private String requesterFirstName;
    private String requesterLastName;
    private String decision;
    private String processedAt;

    // getters / setters
    public String getProcessedAt() {
        return processedAt;
    }
    public void setProcessedAt(String processedAt) {
        this.processedAt = processedAt;
    }
    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getRequesterFirstName() {
        return requesterFirstName;
    }

    public void setRequesterFirstName(String requesterFirstName) {
        this.requesterFirstName = requesterFirstName;
    }

    public String getRequesterLastName() {
        return requesterLastName;
    }

    public void setRequesterLastName(String requesterLastName) {
        this.requesterLastName = requesterLastName;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }
}

