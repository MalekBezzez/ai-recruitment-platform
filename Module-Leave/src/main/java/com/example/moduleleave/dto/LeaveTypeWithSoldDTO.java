package com.example.moduleleave.dto;

public class LeaveTypeWithSoldDTO {
    private Long idLeaveType;
    private String type;
    private double solde;

    // Getters & Setters
    public Long getIdLeaveType() { return idLeaveType; }
    public void setIdLeaveType(Long idLeaveType) { this.idLeaveType = idLeaveType; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getSolde() { return solde; }
    public void setSolde(double solde) { this.solde = solde; }
}