package com.example.moduleleave.dto;

import com.example.moduleleave.entity.LeaveSold;
import com.example.moduleleave.entity.LeaveType;


public class DTOConverter {

    // Méthode existante pour LeaveType seul
    public static LeaveTypeWithSoldDTO convertToWithSoldDTO(LeaveType leaveType) {
        LeaveTypeWithSoldDTO dto = new LeaveTypeWithSoldDTO();
        dto.setIdLeaveType(leaveType.getIdLeaveType());
        dto.setType(leaveType.getType());
        dto.setSolde(leaveType.getSolde());  // on prend le solde du type
        return dto;
    }


    // Nouvelle méthode pour la combinaison LeaveType + LeaveSold
    public static LeaveTypeWithSoldDTO convertToWithSoldDTO(LeaveType leaveType, LeaveSold leaveSold) {
        LeaveTypeWithSoldDTO dto = convertToWithSoldDTO(leaveType);
        if(leaveSold != null) {
            dto.setSolde(leaveSold.getSolde());
              /*  dto.setEmployeeId(leaveSold.getEmploye() != null ?
                        leaveSold.getEmploye().getId() : null);*/
        }
        return dto;
    }

    public static LeaveSoldDTO convertToDTO(LeaveSold leaveSold) {
        LeaveSoldDTO dto = new LeaveSoldDTO();
        dto.setIdLeaveSold(leaveSold.getIdLeaveSold());
        dto.setSolde(leaveSold.getSolde());
        if(leaveSold.getLeaveType() != null) {
            dto.setLeaveTypeId(leaveSold.getLeaveType().getIdLeaveType());
        }
        /*if(leaveSold.getEmploye() != null) {
            dto.setEmployeId(leaveSold.getEmploye().getId());
        }*/
        return dto;
    }
}
