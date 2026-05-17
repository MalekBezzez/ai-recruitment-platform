// src/main/java/com/example/loginpfe/dto/EmployeUpdateDTO.java
package com.example.back.dto;

import java.util.Date;

public class EmployeUpdateDTO {
    // Champs simples
    private String firstname;
    private String lastname;
    private String email;
    private String cin;
    private String personalPhone;
    private String birthPlace;
    private java.util.Date birthDate;
    private String address;
    private String workplace;
    private String professionalemail;
  //  private String businessUnit;
    private Integer salary;
    private String jobTitle;
    private String worktime;
    // etc. ajoutez ici tous vos champs simples…

    // Relations par ID
    private Long managerId;
    private Long insuranceGroupId;
    private Long contractTypeId;
    private Long departmentId;

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

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getPersonalPhone() {
        return personalPhone;
    }

    public void setPersonalPhone(String personalPhone) {
        this.personalPhone = personalPhone;
    }

    public String getBirthPlace() {
        return birthPlace;
    }

    public void setBirthPlace(String birthPlace) {
        this.birthPlace = birthPlace;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getWorkplace() {
        return workplace;
    }

    public void setWorkplace(String workplace) {
        this.workplace = workplace;
    }

    public String getProfessionalemail() {
        return professionalemail;
    }

    public void setProfessionalemail(String professionalemail) {
        this.professionalemail = professionalemail;
    }

    public Integer getSalary() {
        return salary;
    }

    public void setSalary(Integer salary) {
        this.salary = salary;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getWorktime() {
        return worktime;
    }

    public void setWorktime(String worktime) {
        this.worktime = worktime;
    }

    // getters & setters pour chacun…
    public String getFirstname() { return firstname; }
    public void setFirstname(String f) { firstname = f; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }
    public Long getInsuranceGroupId() { return insuranceGroupId; }
    public void setInsuranceGroupId(Long insuranceGroupId) { this.insuranceGroupId = insuranceGroupId; }
    public Long getContractTypeId() { return contractTypeId; }
    public void setContractTypeId(Long contractTypeId) { this.contractTypeId = contractTypeId; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
}
