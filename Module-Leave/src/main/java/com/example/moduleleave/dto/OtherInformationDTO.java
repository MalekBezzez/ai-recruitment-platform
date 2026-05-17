package com.example.moduleleave.dto;



import java.util.Date;

public class OtherInformationDTO {
    private int id;
    private boolean stcServi;
    private Date mariageDate;
    private boolean bankDomiciliation;
    private Integer employeId;

    // Getters et Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isStcServi() {
        return stcServi;
    }

    public void setStcServi(boolean stcServi) {
        this.stcServi = stcServi;
    }

    public Date getMariageDate() {
        return mariageDate;
    }

    public void setMariageDate(Date mariageDate) {
        this.mariageDate = mariageDate;
    }

    public boolean isBankDomiciliation() {
        return bankDomiciliation;
    }

    public void setBankDomiciliation(boolean bankDomiciliation) {
        this.bankDomiciliation = bankDomiciliation;
    }

    public Integer getEmployeId() {
        return employeId;
    }

    public void setEmployeId(Integer employeId) {
        this.employeId = employeId;
    }

    // Méthode pour convertir de l'entité vers le DTO

}
