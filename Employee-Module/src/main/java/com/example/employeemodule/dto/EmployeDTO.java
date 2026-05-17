package com.example.employeemodule.dto;

import com.example.employeemodule.Service.ContractTypeService;
import com.example.employeemodule.Service.DepartmentService;
import com.example.employeemodule.Service.EmployeService;
import com.example.employeemodule.Service.InsuranceService;
import com.example.employeemodule.entity.*;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


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
    private Employe.GenderType gender;
    private Employe.MartialStatusType martialStatus;
    private Date hireDate ;
    // --- Professional ---
    private String jobTitle;
  //  private String businessUnit;
    private String workplace;
    private Employe.SeniorityType seniority;
    private Employe.Worktime worktime;
    private String professionalEmail;
    private String mobilePhone;
    private int salary;
    private User.Role role;

    // --- Financial ---
    private String bankAccountNumber;
    private String socialSecurityCode;
    private String policyNumberIns;

    // --- Relations (IDs) ---
    private Long managerId;
    private Long departmentId;
    private Long contractTypeId;
    private Long insuranceGroupId;
    private Employe.ResetStatus resetStatus;
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
    public Employe.ResetStatus getResetStatus() {
        return resetStatus;
    }
    public void setResetStatus(Employe.ResetStatus resetStatus) {
        this.resetStatus = resetStatus;
    }
    public static EmployeDTO fromEntity(Employe e) {
        if(e==null) return null;
        EmployeDTO dto = new EmployeDTO();
        dto.setId(e.getId());
        dto.setFirstname(e.getFirstname());
        dto.setLastname(e.getLastname());
        dto.setEmail(e.getEmail());
        dto.setCin(e.getCIN());
        dto.setResetStatus(e.getResetStatus());
        dto.setBirthPlace(e.getBirthPlace());
        dto.setBirthDate(e.getBirthDate());
        dto.setNationality(e.getNationality());
        dto.setHireDate(e.getHireDate());
        dto.setNumberOfChildren(e.getNumberOfChildren());
        dto.setPersonalPhone(e.getPersonalPhone());
        dto.setPersonalAddress(e.getPersonalAddress());
        dto.setAddress(e.getAddress());
        dto.setGender(e.getGender());
        dto.setMartialStatus(e.getMartialStatus());

        dto.setJobTitle(e.getJobTitle());
       // dto.setBusinessUnit(e.getBusinessUnit());
        dto.setWorkplace(e.getWorkplace());
        dto.setSeniority(e.getSeniority());
        dto.setWorktime(e.getWorktime());
        dto.setProfessionalEmail(e.getProfessionalemail());
        dto.setMobilePhone(e.getMobilePhone());
        dto.setSalary(e.getSalary());
        dto.setRole(e.getRole());

        dto.setBankAccountNumber(e.getBankAccountNumber());
        dto.setSocialSecurityCode(e.getSocialSecurityCode());
        dto.setPolicyNumberIns(e.getPolicyNumberIns());

        if(e.getManager()!=null) {
            dto.setManagerId(e.getManager().getId());
            dto.setManagerFirstName(e.getManager().getFirstname());
            dto.setManagerLastName(e.getManager().getLastname());
        }
        if(e.getDepartment()!=null)
            dto.setDepartmentId(e.getDepartment().getId());
        if(e.getContractType()!=null)
            dto.setContractTypeId(e.getContractType().getId());
        if(e.getInsuranceGroup()!=null) {
            dto.setInsuranceGroupId(e.getInsuranceGroup().getId());
            dto.setInsuranceGroupName(e.getInsuranceGroup().getName());
        }

        if(e.getDiplomas()!=null) {
            dto.setDiplomas(
                    e.getDiplomas().stream()
                            .map(DiplomaDTO::fromEntity)
                            .collect(Collectors.toList())
            );
        }
        if(e.getOtherInformation()!=null) {
            dto.setOtherInformation(
                    OtherInformationDTO.fromEntity(e.getOtherInformation())
            );
        }
        if(e.getLeaveSolds()!=null) {
            dto.setLeaveSolds(
                    e.getLeaveSolds().stream()
                            .map(LeaveSoldDTO1::fromEntity)
                            .collect(Collectors.toList())
            );
        }
        return dto;
    }

    /**
     * Map from DTO to entity, including child objects
     */
    public static Employe toEntity(
            EmployeDTO dto,
            DepartmentService depSvc,
            ContractTypeService ctSvc,
            InsuranceService insSvc,
            EmployeService empSvc
    ) {
        if(dto==null) return null;
        Employe e = new Employe();
        e.setId(dto.getId());
        e.setFirstname(dto.getFirstname());
        e.setLastname(dto.getLastname());
        e.setEmail(dto.getEmail());
        e.setCIN(dto.getCin());
        e.setBirthPlace(dto.getBirthPlace());
        e.setBirthDate(dto.getBirthDate());
        e.setNationality(dto.getNationality());
        e.setNumberOfChildren(dto.getNumberOfChildren());
        e.setPersonalPhone(dto.getPersonalPhone());
        e.setPersonalAddress(dto.getPersonalAddress());
        e.setAddress(dto.getAddress());
        e.setGender(dto.getGender());
        e.setMartialStatus(dto.getMartialStatus());
        e.setHireDate(dto.getHireDate());
        e.setJobTitle(dto.getJobTitle());
      //  e.setBusinessUnit(dto.getBusinessUnit());
        e.setWorkplace(dto.getWorkplace());
        e.setSeniority(dto.getSeniority());
        e.setWorktime(dto.getWorktime());
        e.setProfessionalemail(dto.getProfessionalEmail());
        e.setMobilePhone(dto.getMobilePhone());
        e.setSalary(dto.getSalary());
        e.setRole(dto.getRole());

        e.setBankAccountNumber(dto.getBankAccountNumber());
        e.setSocialSecurityCode(dto.getSocialSecurityCode());
        e.setPolicyNumberIns(dto.getPolicyNumberIns());

        if(dto.getManagerId()!=null)
            e.setManager(empSvc.getEmployeById(dto.getManagerId()));
        if(dto.getDepartmentId()!=null)
            e.setDepartment(depSvc.getDepartmentById(dto.getDepartmentId()));
        if(dto.getContractTypeId()!=null)
            e.setContractType(ctSvc.getById(dto.getContractTypeId()).orElse(null));
        if(dto.getInsuranceGroupId()!=null)
            e.setInsuranceGroup(insSvc.getInsuranceById(dto.getInsuranceGroupId()).orElse(null));

        if (dto.getDiplomas() != null) {
            List<Diploma> dips = dto.getDiplomas().stream()
                    .map(DiplomaDTO::toEntity)
                    .peek(d -> d.setEmploye(e))  // lier la FK
                    .collect(Collectors.toList());
            e.setDiplomas(dips);
        }
        if(dto.getOtherInformation()!=null) {
            var oi = OtherInformationDTO.toEntity(dto.getOtherInformation());
            oi.setEmploye(e);
            e.setOtherInformation(oi);
        }

        if(dto.getLeaveSolds()!=null)
            e.setLeaveSolds(
                    dto.getLeaveSolds().stream()
                            .map(lsDto->{ var ls = lsDto.toEntity(); ls.setEmploye(e); return ls; })
                            .collect(Collectors.toList())
            );

        return e;
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

    public Employe.GenderType getGender() {
        return gender;
    }

    public void setGender(Employe.GenderType gender) {
        this.gender = gender;
    }

    public Employe.MartialStatusType getMartialStatus() {
        return martialStatus;
    }

    public void setMartialStatus(Employe.MartialStatusType martialStatus) {
        this.martialStatus = martialStatus;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

  /*  public String getBusinessUnit() {
        return businessUnit;
    }

    public void setBusinessUnit(String businessUnit) {
        this.businessUnit = businessUnit;
    }
*/
    public String getWorkplace() {
        return workplace;
    }

    public void setWorkplace(String workplace) {
        this.workplace = workplace;
    }

    public Employe.SeniorityType getSeniority() {
        return seniority;
    }

    public void setSeniority(Employe.SeniorityType seniority) {
        this.seniority = seniority;
    }

    public Employe.Worktime getWorktime() {
        return worktime;
    }

    public void setWorktime(Employe.Worktime worktime) {
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

    public User.Role getRole() {
        return role;
    }

    public void setRole(User.Role role) {
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



