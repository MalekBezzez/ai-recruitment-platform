package com.example.employeemodule.dto;

import com.example.employeemodule.entity.Insurance;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class InsuranceDTO {
    private Long id;
    private String name;
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date endDate;

    private String insuranceProvider;
    private String contactInfo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getInsuranceProvider() {
        return insuranceProvider;
    }

    public void setInsuranceProvider(String insuranceProvider) {
        this.insuranceProvider = insuranceProvider;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public static InsuranceDTO fromEntity(Insurance ins) {
        if (ins == null) return null;
        InsuranceDTO dto = new InsuranceDTO();
        dto.setId(ins.getId());
        dto.setName(ins.getName());
        dto.setDescription(ins.getDescription());
        dto.setStartDate(ins.getStartDate());
        dto.setEndDate(ins.getEndDate());
        dto.setInsuranceProvider(ins.getInsuranceProvider());
        dto.setContactInfo(ins.getContactInfo());
        return dto;
    }

    public static Insurance toEntity(InsuranceDTO dto) {
        if (dto == null) return null;
        Insurance ins = new Insurance();
        // Ne pas setter l’ID ici si vous créez : Hibernate le générera
        ins.setName(dto.getName());
        ins.setDescription(dto.getDescription());
        ins.setStartDate(dto.getStartDate());
        ins.setEndDate(dto.getEndDate());
        ins.setInsuranceProvider(dto.getInsuranceProvider());
        ins.setContactInfo(dto.getContactInfo());
        return ins;
    }
}
