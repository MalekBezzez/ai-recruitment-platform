package com.example.employeemodule.dto;

import com.example.employeemodule.entity.Diploma;
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

    public static DiplomaDTO fromEntity(Diploma d) {
        if (d == null) return null;
        DiplomaDTO dto = new DiplomaDTO();
        dto.setIdDiplome(d.getIdDiplome());
        dto.setSpeciality(d.getSpeciality());
        dto.setInstitution(d.getInstitution());
        dto.setDiplomeType(d.getDiplomeType());
        dto.setDiplomaYear(d.getDiplomaYear());
        dto.setEmployeId(d.getEmploye() != null ? d.getEmploye().getId() : null);
        return dto;
    }

    public static Diploma toEntity(DiplomaDTO dto) {
        if (dto == null) return null;
        Diploma d = new Diploma();
        d.setIdDiplome(dto.getIdDiplome());
        d.setSpeciality(dto.getSpeciality());
        d.setInstitution(dto.getInstitution());
        d.setDiplomeType(dto.getDiplomeType());
        d.setDiplomaYear(dto.getDiplomaYear());
        // on ne touche pas à d.setEmploye(...) ici
        return d;
    }
}
