package com.example.moduleleave.Service;

import com.example.moduleleave.Feign.EmployeClient;
import com.example.moduleleave.Repository.LeaveSoldRepository;
import com.example.moduleleave.entity.Employe;
import com.example.moduleleave.entity.LeaveSold;
import com.example.moduleleave.entity.LeaveType;
import com.example.moduleleave.exception.ResourceNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class LeaveSoldService {

    @Autowired
    private LeaveSoldRepository leaveSoldRepository;

    @Autowired
    private LeaveTypeService leaveTypeService;

    public List<LeaveSold> getAllLeaves() {
        return leaveSoldRepository.findAll();
    }
    public LeaveSold getLeaveSoldForEmployeeAndType(Long employeId, Long leaveTypeId) {

        // Vérifier que le type existe
        LeaveType type = leaveTypeService.getLeaveTypeById(leaveTypeId);
        // Rechercher le LeaveSold
        return leaveSoldRepository
                .findByEmploye_IdAndLeaveType_IdLeaveType(employeId, leaveTypeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Aucun solde trouvé pour l'employé " + employeId +
                                        " et le type de congé " + leaveTypeId
                        )
                );
    }
    public LeaveSold getLeaveById(int id) {
        return leaveSoldRepository.findById(id).orElse(null);
    }

    public LeaveSold createLeave(LeaveSold leaveSold) {
        return leaveSoldRepository.save(leaveSold);
    }

    public LeaveSold updateLeave(int id, LeaveSold leaveSold) {
        leaveSold.setIdLeaveSold(id);
        return leaveSoldRepository.save(leaveSold);
    }


    public void deleteLeave(int id) {
        leaveSoldRepository.deleteById(id);
    }
    public List<LeaveSold> getAllModelLeaveSold() {
        return leaveSoldRepository.findByEmployeIsNull();
    }
    @Transactional
    public void decrementSolde(Long employeId, Long leaveTypeId, long periode) {
        LeaveSold ls = leaveSoldRepository.findByEmploye_IdAndLeaveType_IdLeaveType(employeId, leaveTypeId)
                .orElseThrow(() ->
                        new EntityNotFoundException("LeaveSold introuvable"));
        double nouveauSolde = ls.getSolde() - (int) periode;
        if (nouveauSolde < 0) {
            throw new IllegalStateException("Solde insuffisant…");
        }

        ls.setSolde(nouveauSolde);


    }

}