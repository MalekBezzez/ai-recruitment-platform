package com.example.back.dto;

import com.example.back.enums.CurStatus;

import java.util.Date;

public record OfferSummarizeDTO(
        Long id,
        String jobTitle,
        String contractName,
        String departmentName,
        String reference,
        Integer numberOfPos,
        Date startingDate,
        Date expirationDate,
        Date requestDate,
        Date publishDate,
        boolean published,
        CurStatus status,
        boolean inProcess
) {}


