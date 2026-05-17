package com.example.back.dto;

import java.time.LocalDate;

public record InterviewFilterDTO(
        String applicantName,
        String jobTitle,
        String phone,
        String email,
        String room,
        String interviewer,
        String title,
        String status,
        String applicationType, // "Spontaneous" | "By Offer" | null

        LocalDate startDate,
        LocalDate endDate

) {
}
