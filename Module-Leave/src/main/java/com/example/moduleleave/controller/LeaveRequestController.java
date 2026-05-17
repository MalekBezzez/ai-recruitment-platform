package com.example.moduleleave.controller;

import com.example.moduleleave.dto.LeaveRequestDTO;
import com.example.moduleleave.Service.LeaveRequestService;
import com.example.moduleleave.entity.LeaveRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/leave-requests")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @Autowired
    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping
    public ResponseEntity<List<LeaveRequestDTO>> createLeaveRequest(@RequestBody LeaveRequestDTO leaveRequestDTO) {
        List<LeaveRequest> createdRequests = leaveRequestService.createLeaveRequest(leaveRequestDTO);

        // Convertir chaque LeaveRequest en LeaveRequestDTO
        List<LeaveRequestDTO> responseDTOs = createdRequests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new ResponseEntity<>(responseDTOs, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<LeaveRequestDTO>> getAllLeaveRequests() {
        List<LeaveRequestDTO> dtos = leaveRequestService.getAllLeaveRequests()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequestDTO> getLeaveRequestById(@PathVariable Long id) {
        LeaveRequest request = leaveRequestService.getLeaveRequestById(id);
        return ResponseEntity.ok(convertToDTO(request));
    }
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequestDTO>> getLeaveRequestsByEmployee(@PathVariable Long employeeId) {
        List<LeaveRequestDTO> dtos = leaveRequestService.getLeaveRequestsByEmployee(employeeId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    // Méthodes de conversion
    private LeaveRequestDTO convertToDTO(LeaveRequest leaveRequest) {
        LeaveRequestDTO dto = new LeaveRequestDTO();
        dto.setId(leaveRequest.getId());
        dto.setStartDate(leaveRequest.getStartDate());
        dto.setEndDate(leaveRequest.getEndDate());
        dto.setNumberOfHours(leaveRequest.getNumberOfHours());
        dto.setStatus(leaveRequest.getStatus());
        dto.setDescription(leaveRequest.getDescription());
        //  dto.setHours(leaveRequest.getNumberOfHours());

        if (leaveRequest.getEmployee() != null) {
            dto.setEmployee(leaveRequest.getEmployee());
        }

        if (leaveRequest.getLeaveType() != null) {
            dto.setLeaveTypeId(leaveRequest.getLeaveType().getIdLeaveType());
            dto.setLeaveTypeName(leaveRequest.getLeaveType().getType());
        }

        return dto;
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaveRequest(@PathVariable Long id) {
        leaveRequestService.deleteLeaveRequest(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/validated")
    public ResponseEntity<List<LeaveRequestDTO>> getValidatedLeaveRequestsByEmployeeAndDateRange(
            @RequestParam Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<LeaveRequestDTO> dtos = leaveRequestService.getValidatedLeaveRequestsByEmployeeAndDateRange(employeeId, startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}