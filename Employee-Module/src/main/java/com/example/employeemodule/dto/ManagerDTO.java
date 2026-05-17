package com.example.employeemodule.dto;

import com.example.employeemodule.entity.Employe;
import lombok.Data;

@Data
public class ManagerDTO {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public static ManagerDTO fromEntity(Employe manager) {
        ManagerDTO dto = new ManagerDTO();
        dto.setId(manager.getId());
        dto.setFirstname(manager.getFirstname());
        dto.setLastname(manager.getLastname());
        dto.setEmail(manager.getEmail());
        return dto;
    }

    public ManagerDTO() {
    }

    public ManagerDTO(Long id, String firstname, String lastname, String email) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
    }
}
