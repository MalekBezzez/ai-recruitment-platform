package com.example.back.dto;

import java.time.LocalDateTime;
import java.util.List;

public record InterviewDTO(
        Long id,
        String title,
        LocalDateTime scheduledDate,
        Integer duration,
        String meetingLink,
        String status,
        String room,
        List<EmployeeInterviewerDTO> interviewers  // maybe i will change it

        //Long applicationId
) {}
