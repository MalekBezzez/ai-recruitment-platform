package com.example.back.dto;

import java.util.List;

public  record ScoreDetailsDTO(
        // Match scores
        Double skillsScore,
        Double experienceScore,
        Double educationScore,
        Double languageScore,
        Double certificationScore,
        Double finalScore,
        String justification,

        // Resume info
        String fullName,
        String email,
        String phone,
        Float yearsOfExperience,
        List<String> skills,
        List<String> languages,
        List<String> certifications,
        List<String> educations,
        List<String> experiences,
        List<String> links
) {}
