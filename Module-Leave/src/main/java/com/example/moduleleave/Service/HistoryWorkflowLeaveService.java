package com.example.moduleleave.Service;

import com.example.moduleleave.Feign.EmployeClient;
import com.example.moduleleave.dto.EmployeCreateDTO;
import com.example.moduleleave.dto.HistoryWorkflowLeaveDto;
import java.util.List;


import com.example.moduleleave.entity.Employe;
import com.example.moduleleave.entity.HistoryWorkflowLeave;
import com.example.moduleleave.Repository.HistoryWorkflowLeaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional
public class HistoryWorkflowLeaveService {
@Autowired
    private  HistoryWorkflowLeaveRepository repo;
    @Autowired
    private EmployeClient employeRepo;
    private Employe mapToEmployeEntity(EmployeCreateDTO dto) {
        Employe e = new Employe();
        e.setId(dto.getId());
        e.setFirstname(dto.getFirstname());
        e.setLastname(dto.getLastname());
        e.setEmail(dto.getEmail());

        return e;
    }  private EmployeCreateDTO mapToEmployeCreateDTO(Employe e) {
        EmployeCreateDTO dto = new EmployeCreateDTO();
        dto.setId(e.getId());
        dto.setFirstname(e.getFirstname());
        dto.setLastname(e.getLastname());
        dto.setEmail(e.getEmail());
        // etc. selon les champs de ton DTO
        return dto;
    }

    // Méthodes de mapping
    private HistoryWorkflowLeaveDto toDto(HistoryWorkflowLeave ent) {
        HistoryWorkflowLeaveDto d = new HistoryWorkflowLeaveDto();
        d.setId(ent.getId());
        d.setTaskId(ent.getTaskId());
        d.setTaskName(ent.getTaskName());
        d.setDecision(ent.getDecision());
        d.setComment(ent.getComment());
        d.setCompletedAt(ent.getCompletedAt());
        d.setProcessInstanceId(ent.getProcessInstanceId());
        if (ent.getEmployee() != null) {
            d.setEmployee(mapToEmployeCreateDTO(ent.getEmployee()));
        }

        if (ent.getEmployee() != null) {
            d.setEmployee(mapToEmployeCreateDTO(ent.getEmployee()));
        }

        d.setRequesterId(ent.getRequesterId());
        d.setRequesterFirstName(ent.getRequesterFirstName());
        d.setRequesterLastName(ent.getRequesterLastName());
        d.setLeaveStartDate(ent.getLeaveStartDate());  // nouveau champ
        d.setLeaveEndDate(ent.getLeaveEndDate());      // nouveau champ
        d.setLeaveType(ent.getLeaveType());
        return d;
    }

    private HistoryWorkflowLeave toEntity(HistoryWorkflowLeaveDto d) {
        HistoryWorkflowLeave ent = new HistoryWorkflowLeave();
        ent.setId(d.getId());
        ent.setTaskId(d.getTaskId());
        ent.setTaskName(d.getTaskName());
        ent.setDecision(d.getDecision());
        ent.setComment(d.getComment());
        ent.setCompletedAt(d.getCompletedAt());
        ent.setProcessInstanceId(d.getProcessInstanceId());
        if (d.getEmployee() != null && d.getEmployee().getId() != null) {

            Employe e = mapToEmployeEntity(d.getEmployee());
            ent.setEmployee(e);


        }
        ent.setRequesterId(d.getRequesterId());
        if (d.getEmployee() != null && d.getEmployee().getId() != null) {
            ent.setEmployee(mapToEmployeEntity(d.getEmployee()));
        }


        ent.setRequesterId(d.getRequesterId());
        ent.setRequesterFirstName(d.getRequesterFirstName());
        ent.setRequesterLastName(d.getRequesterLastName());
        d.setLeaveStartDate(ent.getLeaveStartDate());  // nouveau champ
        d.setLeaveEndDate(ent.getLeaveEndDate());      // nouveau champ
        d.setLeaveType(ent.getLeaveType());

        return ent;
    }

    public List<HistoryWorkflowLeaveDto> findAll() {
        return repo.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public HistoryWorkflowLeaveDto findById(Long id) {
        return repo.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Introuvable id=" + id));
    }

    public HistoryWorkflowLeaveDto create(HistoryWorkflowLeaveDto dto) {
        HistoryWorkflowLeave saved = repo.save(toEntity(dto));
        return toDto(saved);
    }

    public HistoryWorkflowLeaveDto update(Long id, HistoryWorkflowLeaveDto dto) {
        HistoryWorkflowLeave existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Introuvable id=" + id));
        // mettez à jour les champs
        existing.setTaskId(dto.getTaskId());
        existing.setTaskName(dto.getTaskName());
        existing.setDecision(dto.getDecision());
        existing.setComment(dto.getComment());
        existing.setCompletedAt(dto.getCompletedAt());
        existing.setProcessInstanceId(dto.getProcessInstanceId());
       // existing.setUserId(dto.getUserId());
        HistoryWorkflowLeave updated = repo.save(existing);
        return toDto(updated);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
