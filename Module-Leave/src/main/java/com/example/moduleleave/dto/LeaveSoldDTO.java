package com.example.moduleleave.dto;

import com.example.moduleleave.entity.LeaveSold;
import com.example.moduleleave.entity.LeaveType;
import com.example.moduleleave.entity.Employe;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class LeaveSoldDTO {
    private int idLeaveSold;
    private double solde;
    private Long leaveTypeId;
    private List<Long> employeIds;

    // Getters & Setters
    public int getIdLeaveSold() {
        return idLeaveSold;
    }

    public void setIdLeaveSold(int idLeaveSold) {
        this.idLeaveSold = idLeaveSold;
    }

    public double getSolde() {
        return solde;
    }

    public void setSolde(double solde) {
        this.solde = solde;
    }

    public Long getLeaveTypeId() {
        return leaveTypeId;
    }

    public void setLeaveTypeId(Long leaveTypeId) {
        this.leaveTypeId = leaveTypeId;
    }

    public List<Long> getEmployeIds() {
        return employeIds;
    }

    public void setEmployeIds(List<Long> employeIds) {
        this.employeIds = employeIds;
    }

    // Méthode pour convertir une entité LeaveSold en DTO
    public static LeaveSoldDTO fromEntity(LeaveSold leaveSold) {
        LeaveSoldDTO dto = new LeaveSoldDTO();
        dto.setIdLeaveSold(leaveSold.getIdLeaveSold());
        dto.setSolde(leaveSold.getSolde());

        if (leaveSold.getLeaveType() != null) {
            dto.setLeaveTypeId(leaveSold.getLeaveType().getIdLeaveType());  // Si LeaveSold a un LeaveType avec un id
        }

        // Si nécessaire, tu peux aussi récupérer l'employeId ici, si c'est une relation avec l'entité Employe.
        if (leaveSold.getEmploye() != null) {
            dto.setEmployeIds(List.of(leaveSold.getEmploye().getId()));
        }


        return dto;
    }

    // Méthode pour convertir le DTO en entité LeaveSold
    public static LeaveSold toEntity(LeaveSoldDTO dto, LeaveType leaveType, Employe employe) {
        if (dto == null) return null;

        LeaveSold entity = new LeaveSold();
        entity.setIdLeaveSold(dto.getIdLeaveSold());
        entity.setSolde(dto.getSolde());

        if (leaveType != null) {
            entity.setLeaveType(leaveType);  // Associer LeaveType à l'entité LeaveSold
        }
        if (employe != null) {
            entity.setEmploye(employe); // plus besoin de liste
        }




        return entity;
    }
}
