package com.example.employeemodule.dto;

import java.util.List;

public class surveyAiDTO {
    private Long initiatorUserId;
    private List<AnswerDTO1> responses;

    public Long getInitiatorUserId() {
        return initiatorUserId;
    }

    public void setInitiatorUserId(Long initiatorUserId) {
        this.initiatorUserId = initiatorUserId;
    }

    public List<AnswerDTO1> getResponses() {
        return responses;
    }

    public void setResponses(List<AnswerDTO1> responses) {
        this.responses = responses;
    }
}
