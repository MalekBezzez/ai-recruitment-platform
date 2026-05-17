package com.example.employeemodule.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class OtherInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private boolean stcServi;
    private Date mariageDate;
    private boolean bankDomiciliation;

    @OneToOne
    @JoinColumn(name = "employe_id")

    private Employe employe;

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

    public Employe getEmploye() {
        return employe;
    }

    public void setEmploye(Employe employe) {
        this.employe = employe;
    }
}
