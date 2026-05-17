package com.example.back.dto;

import java.time.LocalDateTime;
import java.util.List;

public record InterviewResponseDTO(
        Long id, //ID de l'interview
        String title,
        LocalDateTime datetime,
        Integer duration,
        String meetingLink,
        Long siteId,
        Long roomId,
        List<Long> interviewers // <== juste la liste des ids
) {}