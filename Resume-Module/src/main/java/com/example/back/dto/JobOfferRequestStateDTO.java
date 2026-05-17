package com.example.back.dto;

public record JobOfferRequestStateDTO(
        Long jobOfferId,
        String jobOfferName,
        String statusJobOffer,
        String previousComment,
        String currentTaskName
) {}



