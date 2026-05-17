package com.example.employeemodule.dto;


import com.example.employeemodule.entity.Diploma;
import com.example.employeemodule.entity.Employe;
import com.example.employeemodule.entity.Employe.*;
import com.example.employeemodule.entity.User;

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
    private Employe.ResetStatus resetStatus;
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


    public ResetStatus getResetStatus() {
        return resetStatus;
    }

    public void setResetStatus(ResetStatus resetStatus) {
        this.resetStatus = resetStatus;
    }

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
    private EmployeCreateDTO  convertToEmployeCreateDTO(Employe e) {
        EmployeCreateDTO dto = new EmployeCreateDTO();
        dto.setId(e.getId());
        dto.setFirstname(e.getFirstname());
        dto.setLastname(e.getLastname());
        dto.setEmail(e.getEmail());
        dto.setHireDate(e.getHireDate());
        dto.setCin(e.getCIN());
        dto.setBirthDate(e.getBirthDate());
        dto.setBirthPlace(e.getBirthPlace());
        dto.setAddress(e.getAddress());
        dto.setMobilePhone(e.getMobilePhone());
        dto.setPersonalPhone(e.getPersonalPhone());
        dto.setWorkplace(e.getWorkplace());
        dto.setRole(e.getRole());
        dto.setProfessionalemail(e.getProfessionalemail());
        dto.setSalary(e.getSalary());
        dto.setSeniority(e.getSeniority());
        dto.setJobTitle(e.getJobTitle());
        dto.setManagerId(e.getManager() != null ? e.getManager().getId() : null);
        dto.setWorktime(e.getWorktime());
        dto.setPersonalAddress(e.getPersonalAddress());
        dto.setNationality(e.getNationality());
        dto.setBankAccountNumber(e.getBankAccountNumber());
        dto.setSocialSecurityCode(e.getSocialSecurityCode());
        dto.setGender(e.getGender());
        dto.setMartialStatus(e.getMartialStatus());
        dto.setNumberOfChildren(e.getNumberOfChildren());
        dto.setInsuranceGroupId(e.getInsuranceGroup() != null ? e.getInsuranceGroup().getId() : null);
        dto.setContractTypeId(e.getContractType() != null ? e.getContractType().getId() : null);
        dto.setDepartmentId(e.getDepartment() != null ? e.getDepartment().getId() : null);

        // Names for related entities
        dto.setInsuranceGroupName(
                e.getInsuranceGroup() != null ? e.getInsuranceGroup().getName() : null
        );
        dto.setContractTypeName(
                e.getContractType() != null ? e.getContractType().getContractTypeName() : null
        );
        dto.setDepartmentName(
                e.getDepartment() != null ? e.getDepartment().getDepartmentName() : null
        );

        // Convert diplomas to DTOs
        if (e.getDiplomas() != null && !e.getDiplomas().isEmpty()) {
            List<DiplomaDTO> diplomaDTOs = e.getDiplomas().stream()
                    .map(DiplomaDTO::fromEntity)
                    .collect(Collectors.toList());
            dto.setDiplomas(diplomaDTOs);
        } else {
            dto.setDiplomas(null); // or an empty list: Collections.emptyList()
        }

        return dto;
    }
}
