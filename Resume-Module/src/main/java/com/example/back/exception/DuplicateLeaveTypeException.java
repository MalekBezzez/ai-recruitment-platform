package com.example.back.exception;

public class DuplicateLeaveTypeException extends RuntimeException {
    public DuplicateLeaveTypeException(String message) {
        super(message);
    }
}
