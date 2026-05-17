package com.example.employeemodule.dto;

import java.util.List;

public record SelfTrainingSessionDTO(
        String trainingTitle,
        List<String> includedSkills,
        String skillsJustification,
        String trainingJustification,
        String priority,
        String priorityJustification

) {
}
