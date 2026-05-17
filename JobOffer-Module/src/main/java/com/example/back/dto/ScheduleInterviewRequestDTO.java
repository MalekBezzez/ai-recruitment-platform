package com.example.back.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ScheduleInterviewRequestDTO(
        Long applicationId, // Used Only for POST
        String title,
        LocalDateTime datetime,
        Integer duration,
        String meetingLink,
        List<Long> interviewers,
        Long roomId,
        String emailContent

) {
}
