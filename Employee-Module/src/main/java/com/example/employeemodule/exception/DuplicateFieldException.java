package com.example.employeemodule.exception;



public class DuplicateFieldException extends RuntimeException {
    private final String field;
    private final String value;

    public DuplicateFieldException(String field, String value) {
        super(String.format("Duplicate value for %s: %s", field, value));
        this.field = field;
        this.value = value;
    }
    public String getField() { return field; }
    public String getValue() { return value; }
}

