package com.example.back.dto;

import java.util.List;

public record EmployeeSkillAnalyzeRequest(
        List<Long> employeeIds,
        Long requesterId
) {
}
