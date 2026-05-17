package com.example.employeemodule.dto;

import java.util.List;

public record StructuredTrainingDTO(
        String trainingTitle,
        List<String> includedSkills,
        List<ParticipantDTO> participants,
        String skillsJustification,      // ← ajouté pour prendre en compte la justification des compétences
        String trainingJustification,
        String priority,
        String priorityJustification
) {
}
