package com.example.employeemodule.dto;

import java.util.List;

public record CoachingDTO(
        String training_title,
        List<String> included_skills,
        List<ParticipantDTO> participants,
        String skills_justification,
        String training_justification,
        String priority,
        String priority_justification,
        CoachDTO coach,
        String coach_justification

) {
}
