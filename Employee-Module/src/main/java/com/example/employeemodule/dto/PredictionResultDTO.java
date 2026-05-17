package com.example.employeemodule.dto;

import java.util.List;

public class PredictionResultDTO {
    private Long employeeId;
    private String employeeName;
    private List<PredictionItemDTO> predictions;

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public List<PredictionItemDTO> getPredictions() {
        return predictions;
    }

    public void setPredictions(List<PredictionItemDTO> predictions) {
        this.predictions = predictions;
    }
}


