package com.example.employeemodule.dto;

import com.example.employeemodule.entity.OtherInformation;

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
    public static OtherInformationDTO fromEntity(OtherInformation entity) {
        if (entity == null) return null;

        OtherInformationDTO dto = new OtherInformationDTO();
        dto.setId(entity.getId());
        dto.setStcServi(entity.isStcServi());
        dto.setMariageDate(entity.getMariageDate());
        dto.setBankDomiciliation(entity.isBankDomiciliation());
        if (entity.getEmploye() != null) {
            dto.setEmployeId(Math.toIntExact(entity.getEmploye().getId()));  // Mapping de l'ID de l'employé
        }

        return dto;
    }

    // Méthode pour convertir du DTO vers l'entité, avec un objet Employe passé en paramètre
    public static OtherInformation toEntity(OtherInformationDTO dto) {
        if (dto == null) return null;

        OtherInformation entity = new OtherInformation();
        entity.setId(dto.getId());
        entity.setStcServi(dto.isStcServi());
        entity.setMariageDate(dto.getMariageDate());
        entity.setBankDomiciliation(dto.isBankDomiciliation());
      //  entity.setEmploye(employe);  // L'employé est passé ici comme paramètre

        return entity;
    }
}
