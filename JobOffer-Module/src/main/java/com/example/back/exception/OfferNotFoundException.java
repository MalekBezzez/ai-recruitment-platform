package com.example.back.exception;

import java.util.UUID;

public class OfferNotFoundException extends RuntimeException {
    public OfferNotFoundException(UUID id) {
        super("Offre with ID : " + id + "not found");
    }
}
