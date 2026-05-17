package com.example.moduleproject.exception;

import java.util.UUID;

public class OfferNotFoundException extends RuntimeException {
    public OfferNotFoundException(UUID id) {
        super("Offre with ID : " + id + "not found");
    }
}
