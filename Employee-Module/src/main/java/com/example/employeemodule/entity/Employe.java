package com.example.employeemodule.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL, orphanRemoval = true)
    //@JsonBackReference
    @JsonManagedReference("employe-diplomas")
    private List<Diploma> diplomas = new ArrayList<>();

    public List<Diploma> getDiplomas() {
        return diplomas;
    }

    public void setDiplomas(List<Diploma> diplomas) {
        this.diplomas = diplomas;
    }

    private String address;
    private String mobilePhone;
    private String personalPhone;
    private String workplace;
    private String professionalemail;
  //  private String businessUnit;
    private int salary;
private Date hireDate ;
    @Enumerated(EnumType.STRING)
    private SeniorityType seniority;

    private String jobTitle;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "manager_id")
    private Employe manager;




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


    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<LeaveSold> leaveSolds = new ArrayList<>();

    public List<LeaveSold> getLeaveSolds() {
        return leaveSolds;
    }

    public void setLeaveSolds(List<LeaveSold> leaveSolds) {
        this.leaveSolds = leaveSolds;
    }

    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = true)
    private Insurance insuranceGroup;
    @OneToOne(mappedBy = "employe", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private OtherInformation otherInformation;


    @ManyToOne(fetch = FetchType.LAZY,
            cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "contract_type_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JsonBackReference("employe-contractType")
    private ContractType contractType;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
    public enum ResetStatus {
        NONE,
        SUCCESS,
        FAILED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "reset_status")
    private ResetStatus resetStatus = ResetStatus.NONE;


    // --- Getters & Setters ---


    public ResetStatus getResetStatus() {
        return resetStatus;
    }

    public void setResetStatus(ResetStatus resetStatus) {
        this.resetStatus = resetStatus;
    }

    public Date getHireDate() {
        return hireDate;
    }

    public void setHireDate(Date hireDate) {
        this.hireDate = hireDate;
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

    public Employe getManager() {
        return manager;
    }
    public void setManager(Employe manager) {
        this.manager = manager;
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


    public Insurance getInsuranceGroup() {
        return insuranceGroup;
    }
    public void setInsuranceGroup(Insurance insuranceGroup) {
        this.insuranceGroup = insuranceGroup;
    }

    public OtherInformation getOtherInformation() {
        return otherInformation;
    }
    public void setOtherInformation(OtherInformation otherInformation) {
        this.otherInformation = otherInformation;
    }

    public ContractType getContractType() {
        return contractType;
    }
    public void setContractType(ContractType contractType) {
        this.contractType = contractType;
    }

    public Department getDepartment() {
        return department;
    }
    public void setDepartment(Department department) {
        this.department = department;
    }
}
