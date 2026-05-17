package com.example.employeemodule.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLeaveType;

    @Column(nullable = false, unique = true)
    private String type;

    @Column(nullable = true)
    private int solde;

    @OneToMany(mappedBy = "leaveType", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LeaveSold> leaveSolds = new ArrayList<>();

    // Constructors
    public LeaveType() {}

    public LeaveType(String type, int solde) {
        this.type = type;
        this.solde = solde;
    }

    // Getters and Setters
    public Long getIdLeaveType() {
        return idLeaveType;
    }

    public void setIdLeaveType(Long idLeaveType) {
        this.idLeaveType = idLeaveType;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getSolde() {
        return solde;
    }

    public void setSolde(int solde) {
        this.solde = solde;
    }

    public List<LeaveSold> getLeaveSolds() {
        return leaveSolds;
    }

    public void setLeaveSolds(List<LeaveSold> leaveSolds) {
        this.leaveSolds = leaveSolds;
    }
}
