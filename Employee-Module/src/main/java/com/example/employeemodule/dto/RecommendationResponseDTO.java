package com.example.employeemodule.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record RecommendationResponseDTO(
        //what i add
        @JsonProperty("trainingRecommendationPlanId") Long trainingRecommendationPlanId,
        Long requesterId,
        RecommendationPlan recommendationPlan
) {
    public record RecommendationPlan(
            List<SelfTraining> Self_training,
            List<Coaching> Coaching,
            List<StructuredTraining> Structured_training
    ) {}

    public record SelfTraining(
            Long id,
            List<SelfTrainingSession> self_training_sessions
    ) {}

    public record SelfTrainingSession(
            String training_title,
            List<String> included_skills,
            String skills_justification,
            String training_justification,
            String priority,
            String priority_justification
    ) {}

    public record Coaching(
            String training_title,
            List<String> included_skills,
            List<Long> participants,
            String skills_justification,
            String training_justification,
            String priority,
            String priority_justification,
            Long coach,
            String coach_justification
    ) {}

    public record StructuredTraining(
            String training_title,
            List<String> included_skills,
            List<Long> participants,
            String skills_justification,
            String training_justification,
            String priority,
            String priority_justification
    ) {}
}