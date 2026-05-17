package com.example.moduleleave.entity;

import com.example.moduleleave.dto.EmployeDTO;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class LeaveSold {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idLeaveSold;

    private double  solde;

    // Chaque LeaveSold appartient à un et un seul LeaveType
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employe_id")
    @JsonBackReference
    private Employe employe;

    public Employe getEmploye() {
        return employe;
    }

    public void setEmploye(Employe employe) {
        this.employe = employe;
    }
    // --- Getters & Setters ---

    public int getIdLeaveSold() {
        return idLeaveSold;
    }

    public void setIdLeaveSold(int idLeaveSold) {
        this.idLeaveSold = idLeaveSold;
    }

    public double  getSolde() {
        return solde;
    }

    public void setSolde(double solde) {
        this.solde = solde;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }


}
