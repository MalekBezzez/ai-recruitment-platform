package com.example.back.dto;

import com.example.back.entity.User;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public record EmployeeLightDTO(
        Long id,
        String firstname,
        String lastname,
        String email,
        String cin,
        String birthPlace,
        Date birthDate,
        String nationality,
        int numberOfChildren,
        String personalPhone,
        String personalAddress,
        String address,
        @JsonProperty("professionalemail")
        String professionalEmail,
        String mobilePhone,
        User.Role role,
        Long managerId

) {
}
