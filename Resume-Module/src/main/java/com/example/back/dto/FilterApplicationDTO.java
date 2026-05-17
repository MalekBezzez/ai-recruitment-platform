package com.example.back.dto;

import java.util.Date;

public record FilterApplicationDTO(
        String fullName,
        String email,
        String mobilePhone,
        String applicationStatus,
        String applicationType,  // "By offer" ou "Spontaneous"
        String jobTitle,
        Date startDate,
        Date endDate,
        Double minScore,         // utilisé uniquement en mode général
        Long jobOfferId          // utilisé uniquement en mode spécifique
) {}
