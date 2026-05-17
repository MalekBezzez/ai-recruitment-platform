package com.example.moduleleave.Service;


import com.example.moduleleave.Feign.EmployeClient;
import com.example.moduleleave.Repository.LeaveSoldRepository;
import com.example.moduleleave.Repository.LeaveTypeRepository;
import com.example.moduleleave.dto.EmployeDTO;
import com.example.moduleleave.entity.Employe;
import com.example.moduleleave.entity.LeaveSold;
import com.example.moduleleave.entity.LeaveType;
import com.example.moduleleave.exception.DuplicateLeaveTypeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LeaveTypeService {

    @Autowired
    private LeaveTypeRepository leaveTypeRepository;
    @Autowired
    private EmployeClient employeRepository ;
    @Autowired
    private LeaveSoldRepository leaveSoldRepository ;

    public List<LeaveType> getAllLeaveTypes() {
        return leaveTypeRepository.findAll();
    }

    public LeaveType getLeaveTypeById(Long id) {
        return leaveTypeRepository.findById(id).orElse(null);
    }

    @Transactional
    public LeaveType createLeaveType(LeaveType leaveType) {
        // 1) Vérifier l’unicité
        if (leaveTypeRepository.existsByType(leaveType.getType())) {
            throw new DuplicateLeaveTypeException(
                    "Le type '" + leaveType.getType() + "' existe déjà"
            );
        }

        // 2) Sauvegarder le LeaveType
        LeaveType savedType = leaveTypeRepository.save(leaveType);

        // 3) Pour chaque employé, créer un LeaveSold avec le solde par défaut
        List<Employe> allEmployees = employeRepository.getAllEmployes();
        for (Employe emp : allEmployees) {
            LeaveSold sold = new LeaveSold();
            sold.setLeaveType(savedType);
            sold.setEmploye(emp);
            sold.setSolde(savedType.getSolde());
            leaveSoldRepository.save(sold);
        }

        // 4) Retour du type créé
        return savedType;
    }

    public LeaveType updateLeaveType(Long id, LeaveType leaveType) {
        leaveType.setIdLeaveType(id);
        return leaveTypeRepository.save(leaveType);
    }
    public List<LeaveType> getAll() {
        return leaveTypeRepository.findAll();
    }

    public void deleteLeaveType(Long id) {
        leaveTypeRepository.deleteById(id);
    }
}
