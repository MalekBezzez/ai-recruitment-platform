package com.example.employeemodule.dto;

import lombok.Data;

import java.util.List;


import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
@Data

public class NlpAnalysisMessage implements Serializable {
    @JsonProperty("questionnaireId")
    private Long questionnaireId;

    @JsonProperty("token")
    private String token;

    @JsonProperty("responses")
    private List<ResponseDTO> responses;

    private Long initiatorUserId;

    public Long getInitiatorUserId() {
        return initiatorUserId;
    }

    public void setInitiatorUserId(Long initiatorUserId) {
        this.initiatorUserId = initiatorUserId;
    }

    public Long getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(Long questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public List<ResponseDTO> getResponses() {
        return responses;
    }

    public void setResponses(List<ResponseDTO> responses) {
        this.responses = responses;
    }
}
