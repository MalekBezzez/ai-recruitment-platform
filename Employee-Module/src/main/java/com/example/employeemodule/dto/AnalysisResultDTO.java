package com.example.employeemodule.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class AnalysisResultDTO {
    private Long employeeId;
    private Long questionnaireId;

    @JsonProperty("global_satisfaction_%")
    private Double globalSatisfaction;

    @JsonProperty("adjusted_satisfaction_%")
    private Double adjustedSatisfaction;

    @JsonProperty("initiatorUserId")
    private Long initiatorUserId;
    @JsonProperty("dissatisfaction_score_%")
    private Double dissatisfactionScore;
    @JsonProperty("satisfaction_causes")
    private String satisfactionCauses;

    @JsonProperty("dissatisfaction_causes")
    private String dissatisfactionCauses;
    @JsonProperty("analyzed_at")
        private LocalDateTime analyzedAt;


    @JsonProperty("neutral_causes")
    private String neutralCauses;


    public AnalysisResultDTO(Long employeeId,
                             Long questionnaireId,
                             Double globalSatisfaction,
                             Double adjustedSatisfaction,
                             Double dissatisfactionScore,
                             String satisfactionCauses,
                             String dissatisfactionCauses,
                             LocalDateTime analyzedAt) {
        this.employeeId = employeeId;
        this.questionnaireId = questionnaireId;
        this.globalSatisfaction = globalSatisfaction;
        this.adjustedSatisfaction = adjustedSatisfaction;
        this.dissatisfactionScore = dissatisfactionScore;
        this.satisfactionCauses = satisfactionCauses;
        this.dissatisfactionCauses = dissatisfactionCauses;
        this.analyzedAt = analyzedAt;
    }

    public AnalysisResultDTO() {
    }
}

