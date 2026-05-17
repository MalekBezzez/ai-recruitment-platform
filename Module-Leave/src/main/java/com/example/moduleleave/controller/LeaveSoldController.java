package com.example.moduleleave.controller;

import com.example.moduleleave.Feign.EmployeClient;
import com.example.moduleleave.Service.LeaveSoldService;
import com.example.moduleleave.Service.LeaveTypeService;
import com.example.moduleleave.dto.DTOConverter;
import com.example.moduleleave.dto.LeaveSoldDTO;
import com.example.moduleleave.entity.LeaveSold;
import com.example.moduleleave.entity.LeaveType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/leaves")
public class LeaveSoldController {

    @Autowired
    private LeaveSoldService leaveSoldService;

    @Autowired
    private LeaveTypeService leaveTypeService;


    @GetMapping("/{employeeId}/type/{leaveTypeId}")
    public ResponseEntity<LeaveSoldDTO> getSoldeForEmployeeAndType(
            @PathVariable Long employeeId,
            @PathVariable Long leaveTypeId
    ) {
        LeaveSold sold = leaveSoldService
                .getLeaveSoldForEmployeeAndType(employeeId, leaveTypeId);
        LeaveSoldDTO dto = DTOConverter.convertToDTO(sold);
        return ResponseEntity.ok(dto);
    }
    @GetMapping
    public List<LeaveSoldDTO> getAllLeaves() {
        return leaveSoldService.getAllLeaves().stream()
                .map(DTOConverter::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveSoldDTO> getLeaveById(@PathVariable int id) {
        LeaveSold leaveSold = leaveSoldService.getLeaveById(id);

        if(leaveSold != null) {
            return ResponseEntity.ok(DTOConverter.convertToDTO(leaveSold));
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping
    public ResponseEntity<LeaveSoldDTO> createLeave(@RequestBody LeaveSoldDTO dto) {
        LeaveSold leaveSold = convertToEntity(dto);
        LeaveSold created = leaveSoldService.createLeave(leaveSold);
        return ResponseEntity.ok(DTOConverter.convertToDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaveSoldDTO> updateLeave(@PathVariable int id, @RequestBody LeaveSoldDTO dto) {
        LeaveSold leaveSold = convertToEntity(dto);
        LeaveSold updated = leaveSoldService.updateLeave(id, leaveSold);
        return ResponseEntity.ok(DTOConverter.convertToDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeave(@PathVariable int id) {
        leaveSoldService.deleteLeave(id);
        return ResponseEntity.noContent().build();
    }

    private LeaveSold convertToEntity(LeaveSoldDTO dto) {
        LeaveSold entity = new LeaveSold();
        entity.setIdLeaveSold(dto.getIdLeaveSold());
        entity.setSolde(dto.getSolde());

        LeaveType type = leaveTypeService.getLeaveTypeById(dto.getLeaveTypeId())
                ;
        entity.setLeaveType(type);

       /* Employe employe = employeService.getEmployeById(dto.getEmployeId())
                ;
        entity.setEmploye(employe);*/

        return entity;
    }
}