package com.example.back.dto;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;
import java.util.Map;


// DTO for POST ajout et Put
public record OfferRequestDTO (

    String jobTitle,

    @JsonProperty("contract")
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

    Date  startingDate,

    Date  expirationDate,


    Map<String, String> sections ,

    Long createdby


)



// Matches JSONB in entity

{


}

