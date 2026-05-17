package com.example.back.dto;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;
import java.util.Map;



// DTO for Get
public record OfferResponseDTO (

    String jobTitle,

    Long  contractId,

    Integer yearsOfExp,

    @JsonProperty("workMode")
    Long workModeId,

    @JsonProperty("department")
    Long departmentId,

    String reference,

    Float salary,

    @JsonProperty("currency")
    Long currencyId,

    Integer numberOfPos,

    @JsonProperty("diploma")
    Long diplomaId,

    String projectOrClient,

    Date startingDate,

    Date  expirationDate,

    Map<String, String> sections


)
{}


