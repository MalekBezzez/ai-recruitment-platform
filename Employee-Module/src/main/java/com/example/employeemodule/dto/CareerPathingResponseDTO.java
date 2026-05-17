package com.example.employeemodule.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
public record CareerPathingResponseDTO(

        @JsonProperty("careerPathingRecommendationId") String careerPathingRecommendationId,
        @JsonProperty("requester_id") Long requesterId,
        @JsonProperty("career_pathing_result") List<CareerPathingEmployee> careerPathingResult
) {
    public record CareerPathingEmployee(
            @JsonProperty("employee_id") String employeeId,
            @JsonProperty("role") String role,
            @JsonProperty("recommended_jobs") List<CareerPathingJob> recommendedJobs
    ) {}

    public record CareerPathingJob(
            @JsonProperty("title") String title,
            @JsonProperty("match_percentage") int matchPercentage,
            @JsonProperty("justification") String justification,
            @JsonProperty("related_job_skills") List<CareerPathingSkill> relatedJobSkills,
            @JsonProperty("from_company_needs") boolean fromCompanyNeeds
    ) {}

    public record CareerPathingSkill(
            @JsonProperty("related_skill_name") String relatedSkillName,
            @JsonProperty("is_existing_skill") boolean isExistingSkill
    ) {}
}
