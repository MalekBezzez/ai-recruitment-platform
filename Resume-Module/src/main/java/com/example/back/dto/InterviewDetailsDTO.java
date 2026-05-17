package com.example.back.dto;

import java.time.LocalDateTime;
import java.util.List;

public record InterviewDetailsDTO(
        Long id,
        String title,
        LocalDateTime scheduledDate,
        Integer duration,
        String room,
        String meetingLink,
        String status,
        String jobTitle,
        Long applicationId,
        String applicantName,
        String applicantEmail,      // ✅ Nouveau champ
        String applicantPhone,      // ✅ Nouveau champ
        List<EmployeeInterviewerDTO> interviewers,
        String applicationType
) {
}
