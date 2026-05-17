package com.example.employeemodule.dto;

import java.time.LocalDateTime;

public record TrainingRecommendationPlanSummaryDTO(
        Long id,
        String requesterName,
        LocalDateTime createdAt,
        String status

) {
}
