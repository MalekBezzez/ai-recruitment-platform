package com.example.moduleleave.dto;

import com.example.moduleleave.entity.Employe;
import com.example.moduleleave.entity.Employe.*;
import com.example.moduleleave.entity.User;

import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class EmployeCreateDTO {
    // Champs de base
    private Long id;
    private String firstname;
    private Date hireDate ;
    private String lastname;
    private String email;
    private String cin;
    private String birthPlace;

    private Date birthDate;

    private String address;
    private String mobilePhone;
    private String personalPhone;
    private String workplace;
    private User.Role role;



    private String professionalemail;
    //  private String businessUnit;
    private int salary;
    private SeniorityType seniority;
    private String jobTitle;
    private Long managerId; // ID du manager
    private Worktime worktime;
    private String personalAddress;
    private String nationality;
    private String bankAccountNumber;
    private String socialSecurityCode;
    private GenderType gender;
    private MartialStatusType martialStatus;
    private int numberOfChildren;
    private Long insuranceGroupId;
    private Long contractTypeId;
    private Long departmentId;
    private String insuranceGroupName;
    private String contractTypeName;
    private String departmentName;
    private List<DiplomaDTO> diplomas;


    public List<DiplomaDTO> getDiplomas() {
        return diplomas;
    }
    public void setDiplomas(List<DiplomaDTO> diplomas) {
        this.diplomas = diplomas;
    }
    // getters & setters pour ces 3 nouveaux champs
    public String getInsuranceGroupName() { return insuranceGroupName; }
    public void setInsuranceGroupName(String insuranceGroupName) {
        this.insuranceGroupName = insuranceGroupName;
    }
    public String getContractTypeName() { return contractTypeName; }
    public void setContractTypeName(String contractTypeName) {
        this.contractTypeName = contractTypeName;
    }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }
    public User.Role getRole() {
        return role;
    }

    public void setRole(User.Role role) {
        this.role = role;
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

    // private String policyNumberIns;


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
    /*
       public String getPolicyNumberIns() {
           return policyNumberIns;
       }

      public void setPolicyNumberIns(String policyNumberIns) {
           this.policyNumberIns = policyNumberIns;
       }
   */
    public Long getInsuranceGroupId() {
        return insuranceGroupId;
    }

    public void setInsuranceGroupId(Long insuranceGroupId) {
        this.insuranceGroupId = insuranceGroupId;
    }

    public Long getContractTypeId() {
        return contractTypeId;
    }

    public void setContractTypeId(Long contractTypeId) {
        this.contractTypeId = contractTypeId;
    }

    public Date getHireDate() {
        return hireDate;
    }

    public void setHireDate(Date hireDate) {
        this.hireDate = hireDate;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
    public Employe toEntity() {
        Employe employe = new Employe();

        employe.setId(this.id);
        employe.setFirstname(this.firstname);
        employe.setLastname(this.lastname);
        employe.setEmail(this.email);
        employe.setCIN(this.cin);
        employe.setBirthDate(this.birthDate);
        employe.setBirthPlace(this.birthPlace);
        employe.setAddress(this.address);
        employe.setMobilePhone(this.mobilePhone);
        employe.setPersonalPhone(this.personalPhone);
        employe.setWorkplace(this.workplace);
        employe.setProfessionalemail(this.professionalemail);
        employe.setSalary(this.salary);
        employe.setSeniority(this.seniority);
        employe.setJobTitle(this.jobTitle);
        employe.setManagerId(this.managerId);
        employe.setWorktime(this.worktime);
        employe.setPersonalAddress(this.personalAddress);
        employe.setNationality(this.nationality);
        employe.setBankAccountNumber(this.bankAccountNumber);
        employe.setSocialSecurityCode(this.socialSecurityCode);
        employe.setGender(this.gender);
        employe.setMartialStatus(this.martialStatus);
        employe.setNumberOfChildren(this.numberOfChildren);
        employe.setHireDate(this.hireDate);
        employe.setInsuranceGroupId(this.insuranceGroupId);
        employe.setContractTypeId(this.contractTypeId);
        employe.setDepartmentId(this.departmentId);

        // Hérité de User
        employe.setRole(this.role);

        return employe;
    }

}
