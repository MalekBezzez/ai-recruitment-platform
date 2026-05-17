package com.example.employeemodule.dto;

import java.util.List;

public record CareerPathingResultDTO(
        Long employeeId,
        String employeeFullName,
        List<JobDTO> recommendedJobs
) {
}
