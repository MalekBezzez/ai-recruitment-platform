package com.example.employeemodule.dto;



import com.example.employeemodule.entity.Employe;
import com.example.employeemodule.entity.LeaveSold;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveSoldDTO1 {
    private int idLeaveSold;
    private double solde;
    private Long leaveTypeId; // Assuming you want to reference LeaveType by ID

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
    // Additional fields can be added as needed
    public LeaveSold toEntity() {
        var ls = new LeaveSold();
        ls.setSolde(this.getSolde());
        // leaveType must be set separately
        return ls;
    }

    public static LeaveSoldDTO1 fromEntity(LeaveSold ls) {
        var dto = new LeaveSoldDTO1();
        dto.setIdLeaveSold(ls.getIdLeaveSold());
        dto.setLeaveTypeId(ls.getLeaveType().getIdLeaveType());
        dto.setSolde(ls.getSolde());
        return dto;
    }
}