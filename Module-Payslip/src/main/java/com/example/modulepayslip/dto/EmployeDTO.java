package com.example.modulepayslip.dto;




import com.example.modulepayslip.enums.*;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class EmployeDTO {
    // --- Base fields ---
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String cin;
    private String birthPlace;
    private Date birthDate;
    private String nationality;
    private int numberOfChildren;
    private String personalPhone;
    private String personalAddress;
    private String address;
    private GenderType gender;
    private MartialStatusType martialStatus;
    private Date hireDate ;
    // --- Professional ---
    private String jobTitle;
    //  private String businessUnit;
    private String workplace;
    private SeniorityType seniority;
    private Worktime worktime;
    private String professionalEmail;
    private String mobilePhone;
    private int salary;
    private Role role;

    // --- Financial ---
    private String bankAccountNumber;
    private String socialSecurityCode;
    private String policyNumberIns;

    // --- Relations (IDs) ---
    private Long managerId;
    private Long departmentId;
    private Long contractTypeId;
    private Long insuranceGroupId;

    // --- Display names for relations ---
    private String managerFirstName;
    private String managerLastName;
    private String insuranceGroupName;

    // --- Child lists ---
    private List<DiplomaDTO> diplomas;
    private OtherInformationDTO otherInformation;
    private List<LeaveSoldDTO1> leaveSolds;

    public Date getHireDate() {
        return hireDate;
    }

    public void setHireDate(Date hireDate) {
        this.hireDate = hireDate;
    }

    /**
     * Map from entity to DTO
     */


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

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
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

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public int getNumberOfChildren() {
        return numberOfChildren;
    }

    public void setNumberOfChildren(int numberOfChildren) {
        this.numberOfChildren = numberOfChildren;
    }

    public String getPersonalPhone() {
        return personalPhone;
    }

    public void setPersonalPhone(String personalPhone) {
        this.personalPhone = personalPhone;
    }

    public String getPersonalAddress() {
        return personalAddress;
    }

    public void setPersonalAddress(String personalAddress) {
        this.personalAddress = personalAddress;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }


    public String getWorkplace() {
        return workplace;
    }

    public void setWorkplace(String workplace) {
        this.workplace = workplace;
    }

    public SeniorityType getSeniority() {
        return seniority;
    }

    public void setSeniority(SeniorityType seniority) {
        this.seniority = seniority;
    }

    public Worktime getWorktime() {
        return worktime;
    }

    public void setWorktime(Worktime worktime) {
        this.worktime = worktime;
    }

    public String getProfessionalEmail() {
        return professionalEmail;
    }

    public void setProfessionalEmail(String professionalEmail) {
        this.professionalEmail = professionalEmail;
    }

    public String getMobilePhone() {
        return mobilePhone;
    }

    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }

    public int getSalary() {
        return salary;
    }

    public void setSalary(int salary) {
        this.salary = salary;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
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

    public String getPolicyNumberIns() {
        return policyNumberIns;
    }

    public void setPolicyNumberIns(String policyNumberIns) {
        this.policyNumberIns = policyNumberIns;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getContractTypeId() {
        return contractTypeId;
    }

    public void setContractTypeId(Long contractTypeId) {
        this.contractTypeId = contractTypeId;
    }

    public Long getInsuranceGroupId() {
        return insuranceGroupId;
    }

    public void setInsuranceGroupId(Long insuranceGroupId) {
        this.insuranceGroupId = insuranceGroupId;
    }

    public String getManagerFirstName() {
        return managerFirstName;
    }

    public void setManagerFirstName(String managerFirstName) {
        this.managerFirstName = managerFirstName;
    }

    public String getManagerLastName() {
        return managerLastName;
    }

    public void setManagerLastName(String managerLastName) {
        this.managerLastName = managerLastName;
    }

    public String getInsuranceGroupName() {
        return insuranceGroupName;
    }

    public void setInsuranceGroupName(String insuranceGroupName) {
        this.insuranceGroupName = insuranceGroupName;
    }

    public List<DiplomaDTO> getDiplomas() {
        return diplomas;
    }

    public void setDiplomas(List<DiplomaDTO> diplomas) {
        this.diplomas = diplomas;
    }

    public OtherInformationDTO getOtherInformation() {
        return otherInformation;
    }

    public void setOtherInformation(OtherInformationDTO otherInformation) {
        this.otherInformation = otherInformation;
    }

    public List<LeaveSoldDTO1> getLeaveSolds() {
        return leaveSolds;
    }

    public void setLeaveSolds(List<LeaveSoldDTO1> leaveSolds) {
        this.leaveSolds = leaveSolds;
    }
}



