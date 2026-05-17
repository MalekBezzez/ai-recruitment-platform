package com.example.back.dto;

import java.util.Date;

public record ApplicationDTO(
        Long id,
        String email,
        String firstName,
        String lastName,
        String mobilePhone,
        byte[] cvFile,
        Date applicationDate,
        String applicationStatus,
        Long jobOfferId
) {}
