package com.example.back.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CamundaVariableResponse {
    private String name;
    private String type;
    private String value;
    private String processInstanceId;
    private String taskId;  // Optionnel, peut être null
}