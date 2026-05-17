package com.example.employeemodule.dto;



import com.example.employeemodule.entity.Insurance;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.util.Date;

@Data
public class InsuranceDTO1 {
    private Long id;
    private String name;
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date endDate;

    private String insuranceProvider;
    private String contactInfo;

    public static InsuranceDTO1 fromEntity(Insurance insurance) {
        if (insurance == null) {return null ;}
        InsuranceDTO1 dto = new InsuranceDTO1();
        dto.setId(insurance.getId());
        dto.setName(insurance.getName());
        dto.setDescription(insurance.getDescription());
        dto.setStartDate(insurance.getStartDate());
        dto.setEndDate(insurance.getEndDate());
        dto.setInsuranceProvider(insurance.getInsuranceProvider());
        dto.setContactInfo(insurance.getContactInfo());
        return dto;
    }

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
    public static Insurance toEntity(InsuranceDTO dto) {
        if (dto == null) {
            return null;
        }

        Insurance insurance = new Insurance();



        insurance.setId(dto.getId());
        insurance.setName(dto.getName());
        insurance.setDescription(dto.getDescription());
        insurance.setStartDate(dto.getStartDate());
        insurance.setEndDate(dto.getEndDate());
        insurance.setInsuranceProvider(dto.getInsuranceProvider());
        insurance.setContactInfo(dto.getContactInfo());
        return insurance;
    }

}