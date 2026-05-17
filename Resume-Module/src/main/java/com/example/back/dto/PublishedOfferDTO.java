package com.example.back.dto;

import java.util.Date;

public record PublishedOfferDTO(
        Long idJobOffer,
        String title,
        String department,
        Date publishDate,
        int nbApplications,
        boolean isCompleted,
        Date completedDate
) {}
