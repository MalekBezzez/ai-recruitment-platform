package com.example.employeemodule.dto;

public class EmployeShortDTO {
    private Long id;
    private String firstname;
    private String lastname;

    public EmployeShortDTO(Long id, String firstname, String lastname) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    // getters/setters...
}
