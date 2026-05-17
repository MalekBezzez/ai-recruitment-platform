package com.example.back.dto;

import java.util.Date;

public record ApplicationResponseDTO(
        Long applicationId,
        String fullName,

        String phone,
        String email,

        Date postulationDate,
        String status,
        Double matchingScore,
        //byte[] cvFile
        String cvFileBase64
) {}