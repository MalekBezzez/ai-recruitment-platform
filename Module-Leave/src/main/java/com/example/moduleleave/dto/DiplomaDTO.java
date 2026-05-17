package com.example.moduleleave.dto;


import lombok.Data;

@Data
public class DiplomaDTO {
    private int idDiplome;
    private String speciality;
    private String institution;
    private String diplomeType;
    private String diplomaYear;
    private Long employeId;

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

    public void setDiplomeType(String diplomeType) {
        this.diplomeType = diplomeType;
    }

    public String getDiplomaYear() {
        return diplomaYear;
    }

    public void setDiplomaYear(String diplomaYear) {
        this.diplomaYear = diplomaYear;
    }

    public Long getEmployeId() {
        return employeId;
    }

    public void setEmployeId(Long employeId) {
        this.employeId = employeId;
    }


}
