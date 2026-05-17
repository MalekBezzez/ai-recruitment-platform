package com.example.moduleleave.exception;

public class DuplicateLeaveTypeException extends RuntimeException {
    public DuplicateLeaveTypeException(String message) {
        super(message);
    }
}
