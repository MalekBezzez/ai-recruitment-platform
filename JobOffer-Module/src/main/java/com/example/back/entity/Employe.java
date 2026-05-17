package com.example.back.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;
// this version of employe is simplified
@Data
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "employe")
public class Employe extends User {

    public enum Worktime { H48, H40, MATERNITY }
    public enum MartialStatusType { SINGLE, MARRIED, DIVORCED }
    public enum GenderType { FEMALE, MALE }
    public enum SeniorityType { BEGINNER, MIDJUNIOR, JUNIOR, SENIOR }

    private String address;
    private String mobilePhone;
    private String personalPhone;
    private String workplace;
    private String professionalemail;
    private int salary;

    @Enumerated(EnumType.STRING)
    private SeniorityType seniority;

    private String jobTitle;

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

    // ✅ Toutes les relations @OneToMany et @ManyToOne supprimées
}