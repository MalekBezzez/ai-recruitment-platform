package com.example.moduleproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.util.Date;

@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Entity
public class Employe extends User {

    public enum Worktime {
        H48, H40, MATERNITY
    }

    public enum MartialStatusType {
        SINGLE, MARRIED, DIVORCED
    }

    public enum GenderType {
        FEMALE, MALE
    }

    public enum SeniorityType {
        BEGINNER, MIDJUNIOR, JUNIOR, SENIOR
    }

    private String address;
    private String mobilePhone;
    private String personalPhone;
    private String workplace;
    private String professionalemail;
    private int salary;
    private Date hireDate;

    @Enumerated(EnumType.STRING)
    private SeniorityType seniority;

    private String jobTitle;

    @Column(name = "manager_id")
    private Long managerId;

    private Long contractTypeId;

    private Long departmentId;

    private Long insuranceGroupId;

    private Long otherInformationId; // si tu veux stocker l'id du OtherInformation
    @Enumerated(EnumType.STRING)
    private Worktime worktime;



    private String personalAddress;
    private String nationality;
    private String bankAccountNumber;
    private String socialSecurityCode;

    @Enumerated(EnumType.STRING)
    private GenderType gender;

    @Enumerated(EnumType.STRING)
    private MartialStatusType martialStatus;

    private int numberOfChildren;
    private Date birthDate;
    private String birthPlace;
    private String policyNumberIns;

    // getters & setters

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    public String getMobilePhone() {
        return mobilePhone;
    }
    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }

    public String getPersonalPhone() {
        return personalPhone;
    }
    public void setPersonalPhone(String personalPhone) {
        this.personalPhone = personalPhone;
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

    public int getSalary() {
        return salary;
    }
    public void setSalary(int salary) {
        this.salary = salary;
    }

    public Date getHireDate() {
        return hireDate;
    }
    public void setHireDate(Date hireDate) {
        this.hireDate = hireDate;
    }

    public SeniorityType getSeniority() {
        return seniority;
    }
    public void setSeniority(SeniorityType seniority) {
        this.seniority = seniority;
    }

    public String getJobTitle() {
        return jobTitle;
    }
    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public Long getManagerId() {
        return managerId;
    }
    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public Long getContractTypeId() {
        return contractTypeId;
    }
    public void setContractTypeId(Long contractTypeId) {
        this.contractTypeId = contractTypeId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }
    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getInsuranceGroupId() {
        return insuranceGroupId;
    }
    public void setInsuranceGroupId(Long insuranceGroupId) {
        this.insuranceGroupId = insuranceGroupId;
    }

    public Long getOtherInformationId() {
        return otherInformationId;
    }
    public void setOtherInformationId(Long otherInformationId) {
        this.otherInformationId = otherInformationId;
    }

    public Worktime getWorktime() {
        return worktime;
    }
    public void setWorktime(Worktime worktime) {
        this.worktime = worktime;
    }

    public String getPersonalAddress() {
        return personalAddress;
    }
    public void setPersonalAddress(String personalAddress) {
        this.personalAddress = personalAddress;
    }

    public String getNationality() {
        return nationality;
    }
    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }
    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getSocialSecurityCode() {
        return socialSecurityCode;
    }
    public void setSocialSecurityCode(String socialSecurityCode) {
        this.socialSecurityCode = socialSecurityCode;
    }

    public GenderType getGender() {
        return gender;
    }
    public void setGender(GenderType gender) {
        this.gender = gender;
    }

    public MartialStatusType getMartialStatus() {
        return martialStatus;
    }
    public void setMartialStatus(MartialStatusType martialStatus) {
        this.martialStatus = martialStatus;
    }

    public int getNumberOfChildren() {
        return numberOfChildren;
    }
    public void setNumberOfChildren(int numberOfChildren) {
        this.numberOfChildren = numberOfChildren;
    }

    public Date getBirthDate() {
        return birthDate;
    }
    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getBirthPlace() {
        return birthPlace;
    }
    public void setBirthPlace(String birthPlace) {
        this.birthPlace = birthPlace;
    }

    public String getPolicyNumberIns() {
        return policyNumberIns;
    }
    public void setPolicyNumberIns(String policyNumberIns) {
        this.policyNumberIns = policyNumberIns;
    }
}
