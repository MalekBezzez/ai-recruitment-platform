package com.example.employeemodule.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.List;

public class NlpAnalysisMessage1 implements Serializable {

    @JsonProperty("responses")
    private List<ResponseDTO1> responses;

    public NlpAnalysisMessage1() {}

    public List<ResponseDTO1> getResponses() {
        return responses;
    }

    public void setResponses(List<ResponseDTO1> responses) {
        this.responses = responses;
    }
}
