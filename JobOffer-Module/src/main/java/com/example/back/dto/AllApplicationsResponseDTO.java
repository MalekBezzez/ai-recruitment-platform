package com.example.back.dto;

import java.util.Date;

public record AllApplicationsResponseDTO(
        Long applicationId,
        String fullName,
        String email,
        String phone,
        String cvFileBase64,      // null si non utilisé côté front
        Date postulationDate,
        String status,
        Double matchingScore,     // null si Spontaneous
        String jobTitle,          // soit jobOffer.getJobTitle() soit spontaneousJobTitle
        String applicationType   // "By offer" ou "Spontaneous"

) {}