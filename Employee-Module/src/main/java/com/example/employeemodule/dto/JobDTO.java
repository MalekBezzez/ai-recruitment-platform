package com.example.employeemodule.dto;

import java.util.List;

public record JobDTO(
        String title,
        int matchPercentage,
        String justification,
        List<SkillDTO> relatedJobSkills,
        boolean fromCompanyNeeds
) {
}
