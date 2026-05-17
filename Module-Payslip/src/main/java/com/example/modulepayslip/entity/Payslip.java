package com.example.modulepayslip.entity;


import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "payslip")
public class Payslip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long payslipId;
    private double netSalary;
    private double grossSalary; // ✅ Nouveau champ pour salaire net avant déductions
    private double baseSalary;
    private double deductions;
    private Date date;
    private double unjustifiedAbsences;
    private int presentDays; // ✅ Nouveau champ pour nombre de jours présents
    @ElementCollection
    private List<Long> imputationIds;
    private Long userId;
    private Date startDate;
    private double irppDeduction; // ✅ Nouveau champ pour IRPP
    private double cnssDeduction;

    public double getIrppDeduction() {
        return irppDeduction;
    }

    public void setIrppDeduction(double irppDeduction) {
        this.irppDeduction = irppDeduction;
    }

    public double getCnssDeduction() {
        return cnssDeduction;
    }

    public void setCnssDeduction(double cnssDeduction) {
        this.cnssDeduction = cnssDeduction;
    }

    // Getters and Setters
    public Long getPayslipId() { return payslipId; }
    public void setPayslipId(Long payslipId) { this.payslipId = payslipId; }

    public double getNetSalary() { return netSalary; }
    public void setNetSalary(double netSalary) { this.netSalary = netSalary; }

    // ✅ Getter/Setter pour grossSalary
    public double getGrossSalary() { return grossSalary; }
    public void setGrossSalary(double grossSalary) { this.grossSalary = grossSalary; }

    public double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(double baseSalary) { this.baseSalary = baseSalary; }

    public double getDeductions() { return deductions; }
    public void setDeductions(double deductions) { this.deductions = deductions; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public double getUnjustifiedAbsences() { return unjustifiedAbsences; }
    public void setUnjustifiedAbsences(double unjustifiedAbsences) { this.unjustifiedAbsences = unjustifiedAbsences; }

    // ✅ Getter/Setter pour presentDays
    public int getPresentDays() { return presentDays; }
    public void setPresentDays(int presentDays) { this.presentDays = presentDays; }

    public List<Long> getImputationIds() {
        return imputationIds;
    }

    public void setImputationIds(List<Long> imputationIds) {
        this.imputationIds = imputationIds;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
}