package com.example.moduleleave.dto;

public class LeaveTypeWithSoldRequest {
    private String type;
    private int solde;
    private Long employeeId;   // <— dé-commente

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getSolde() {
        return solde;
    }

    public void setSolde(int solde) {
        this.solde = solde;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }
}
