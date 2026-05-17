package com.example.back.dto;

import java.util.Date;
import java.util.Map;

public record OfferDetailsDTO(

        String jobTitle,


        String  contractName,

        Integer yearsOfExp,


        String workModeName,


        String departmentName,

        String reference,

        Float salary,

        String currencyName ,

        Integer numberOfPos,

        String diplomaName,
        String diplomaSpeciality,

        String projectOrClient,

        Date startingDate,

        Date  expirationDate,


        Map<String, String> sections



) {

}
