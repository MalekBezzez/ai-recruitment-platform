package com.example.employeemodule.dto;

import java.util.List;

public class GroupedPredictionResultDTO {
    private String id;
    private List<PredictionItemDTO> items;

    public GroupedPredictionResultDTO(String id, List<PredictionItemDTO> items) {
        this.id = id;
        this.items = items;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<PredictionItemDTO> getItems() {
        return items;
    }

    public void setItems(List<PredictionItemDTO> items) {
        this.items = items;
    }
}
