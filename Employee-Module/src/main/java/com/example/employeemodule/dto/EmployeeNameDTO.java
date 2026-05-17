package com.example.employeemodule.dto;

public class EmployeeNameDTO {
    private String taskId;
    private String firstName;
    private String lastName;

    public EmployeeNameDTO() { }

    public EmployeeNameDTO(String taskId, String firstName, String lastName) {
        this.taskId   = taskId;
        this.firstName = firstName;
        this.lastName  = lastName;
    }

    // getters / setters
    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
}
