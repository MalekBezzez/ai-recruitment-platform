package com.example.moduleleave.controller;

import com.example.moduleleave.Service.LeaveSoldService;
import com.example.moduleleave.Service.LeaveTypeService;
import com.example.moduleleave.dto.DTOConverter;
import com.example.moduleleave.dto.LeaveTypeDTO;
import com.example.moduleleave.dto.LeaveTypeWithSoldDTO;
import com.example.moduleleave.dto.LeaveTypeWithSoldRequest;
import com.example.moduleleave.entity.LeaveType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/leave-types")
public class LeaveTypeController {

    @Autowired
    private LeaveTypeService leaveTypeService;

    @GetMapping
    public List<LeaveTypeWithSoldDTO> getAllLeaveTypes() {
        return leaveTypeService.getAllLeaveTypes().stream()
                .map(DTOConverter::convertToWithSoldDTO)
                .collect(Collectors.toList());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaveType(@PathVariable Long id) {
        leaveTypeService.deleteLeaveType(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/with-sold")
    public ResponseEntity<LeaveTypeWithSoldDTO> createLeaveTypeWithSold(
            @RequestBody LeaveTypeWithSoldRequest req
    ) {
        // 1) Construire l'entité LeaveType
        LeaveType type = new LeaveType();
        type.setType(req.getType());
        type.setSolde(req.getSolde());

        // 2) Appeler la méthode transactionnelle qui gère tout
        LeaveType savedType = leaveTypeService.createLeaveType(type);

        // 3) Construire le DTO de retour
        LeaveTypeWithSoldDTO dto = new LeaveTypeWithSoldDTO();
        dto.setIdLeaveType(savedType.getIdLeaveType());
        dto.setType(savedType.getType());
        dto.setSolde(savedType.getSolde());

        // 4) Répondre avec HTTP 201 Created
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(dto);
    }
    @GetMapping("/{id}")
    public ResponseEntity<LeaveTypeWithSoldDTO> getLeaveTypeById(@PathVariable Long id) {
        LeaveType leaveType = leaveTypeService.getLeaveTypeById(id);

        if (leaveType != null) {
            return ResponseEntity.ok(DTOConverter.convertToWithSoldDTO(leaveType));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping
    public LeaveTypeWithSoldDTO createLeaveType(@RequestBody LeaveTypeDTO leaveTypeDTO) {
        LeaveType leaveType = new LeaveType();
        leaveType.setType(leaveTypeDTO.getType());
        LeaveType created = leaveTypeService.createLeaveType(leaveType);
        return DTOConverter.convertToWithSoldDTO(created);
    }
}