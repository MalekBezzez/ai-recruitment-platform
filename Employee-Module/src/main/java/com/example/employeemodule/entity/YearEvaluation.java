package com.example.employeemodule.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class YearEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idYearEvaluation;

    private Date date;
    private String note;

    @ManyToOne

    @JoinColumn(name = "employe_id")
    @JsonIgnore
    private Employe employe;
    // Getters and Setters

    public int getIdYearEvaluation() {
        return idYearEvaluation;
    }

    public void setIdYearEvaluation(int idYearEvaluation) {
        this.idYearEvaluation = idYearEvaluation;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Employe getEmploye() {
        return employe;
    }

    public void setEmploye(Employe employe) {
        this.employe = employe;
    }
}