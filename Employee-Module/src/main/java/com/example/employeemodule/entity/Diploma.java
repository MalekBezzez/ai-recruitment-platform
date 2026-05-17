package com.example.employeemodule.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;


@Entity
public class Diploma {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idDiplome;
    @Column(name = "speciality")
    private String speciality;
    private String institution;
    private String diplomeType;
    private String diplomaYear;
    @ManyToOne
    @JoinColumn(name = "employe_id", referencedColumnName = "id")
    @JsonBackReference("employe-diplomas")
    private Employe employe;


    public int getIdDiplome() {
        return idDiplome;
    }

    public void setIdDiplome(int idDiplome) {
        this.idDiplome = idDiplome;
    }

    public String getSpeciality() {
        return speciality;
    }

    public void setSpeciality(String speciality) {
        this.speciality = speciality;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getDiplomeType() {
        return diplomeType;
    }

    public void setDiplomeType(String diploma) {
        this.diplomeType = diploma;
    }

    public String getDiplomaYear() {
        return diplomaYear;
    }

    public void setDiplomaYear(String diplomaYear) {
        this.diplomaYear = diplomaYear;
    }

    public Employe getEmploye() {
        return employe;
    }

    public void setEmploye(Employe employe) {
        this.employe = employe;
    }
}
