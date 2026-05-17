package com.example.back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;


public record CvProcessingResultDTO(
        @JsonProperty("applicationId") Long applicationId,
        @JsonProperty("parsing_result") ParsingResultDTO parsingResult,
        @JsonProperty("matching_result") MatchingResultDTO matchingResult // Peut être null
) {

    public record ParsingResultDTO(
            String name,
            String email,
            String phone,
            String linkedin,
            String github,
            List<OtherLinkDTO> other,
            String address,
            List<String> skills,
            List<LanguageDTO> languages,
            List<EducationDTO> education,
            List<ExperienceDTO> experience,
            @JsonProperty("years_of_experience") String yearsOfExperience,
            List<CertificationDTO> certifications
    ) {}

    public record OtherLinkDTO(
            String type,
            String link
    ) {}

    public record LanguageDTO(
            String language,
            String level
    ) {}

    public record EducationDTO(
            String degree,
            String institution,
            @JsonProperty("start_date") String startDate,
            @JsonProperty("end_date") String endDate
    ) {}

    public record ExperienceDTO(
            String title,
            String company,
            @JsonProperty("start_date") String startDate,
            @JsonProperty("end_date") String endDate,
            String description,
            String type
    ) {}

    public record CertificationDTO(
            String certification,
            @JsonProperty("obtention_date") String obtentionDate
    ) {}

    public record MatchingResultDTO(
            @JsonProperty("skills_score") double skillsScore,
            @JsonProperty("experience_score") double experienceScore,
            @JsonProperty("education_score") double educationScore,
            @JsonProperty("language_score") double languageScore,
            @JsonProperty("certification_score") double certificationScore,
            @JsonProperty("final_score") double finalScore,
            String justification
    ) {}
}