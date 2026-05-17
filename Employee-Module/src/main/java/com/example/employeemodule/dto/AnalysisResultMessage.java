package com.example.employeemodule.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class AnalysisResultMessage implements Serializable {

    @JsonProperty("questionnaireId")
    private Long questionnaireId;
    @JsonProperty("initiatorUserId")
    private Long initiatorUserId;
    @JsonProperty("results")
    private List<AnalysisResultDTO> results;


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

    public List<AnalysisResultDTO> getResults() {
        return results;
    }

    public void setResults(List<AnalysisResultDTO> results) {
        this.results = results;
    }
}