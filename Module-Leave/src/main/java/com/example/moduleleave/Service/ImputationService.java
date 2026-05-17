package com.example.moduleleave.Service;

import com.example.moduleleave.Feign.EmployeClient;
import com.example.moduleleave.Feign.ProjectClient;
import com.example.moduleleave.Repository.ImputationRepository;
import com.example.moduleleave.dto.EmployeCreateDTO;
import com.example.moduleleave.dto.ImputationDTO;
import com.example.moduleleave.dto.ProjectDTO;
import com.example.moduleleave.dto.TaskDTO1;
import com.example.moduleleave.entity.Employe;
import com.example.moduleleave.entity.Imputation;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImputationService {

    @Autowired
    private ImputationRepository repository;

    @Autowired
    private ProjectClient projectClient;



    @Autowired
    private EmployeClient employeRepository;

    // Feign pour récupérer un projet
    public ProjectDTO getProjectDetails(Long projectId) {
        return projectClient.getProjectById(projectId);
    }

    // Feign pour récupérer une tâche


    @Transactional
    public void deleteInvalidImputationsByUserId(Long userId) {
        repository.deleteByEmployeeIdAndValideeFalse(userId);
    }

    public List<ImputationDTO> getByUserId(Long userId) {
        return repository.findByEmployee_Id(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ImputationDTO> getInvalidImputationsByUserId(Long userId) {
        return getByUserId(userId)
                .stream()
                .filter(imputation -> !imputation.isValide())
                .collect(Collectors.toList());
    }

    public List<ImputationDTO> getDraftImputationsByUserId(Long userId) {
        return getByUserId(userId)
                .stream()
                .filter(ImputationDTO::isDraft)
                .collect(Collectors.toList());
    }

    public List<ImputationDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ImputationDTO getById(Long id) {
        return repository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    @Transactional
    public ImputationDTO create(ImputationDTO dto) {
        if (dto == null) throw new IllegalArgumentException("Imputation DTO must not be null");

        Imputation imputation = new Imputation();
        imputation.setDate(dto.getDate());
        imputation.setHours(dto.getHours());
        imputation.setStartedTime(dto.getStartedTime());
        imputation.setEndTime(dto.getEndTime());
        imputation.setDescription(dto.getDescription());
        imputation.setValidee(dto.isValide());
        imputation.setDraft(dto.isDraft());

        if (dto.getUserId() == null) throw new IllegalArgumentException("User ID must not be null");

        EmployeCreateDTO empDto = employeRepository.getEmployeById(dto.getUserId());
        Employe emp = empDto.toEntity();
        imputation.setEmployee(emp);

        // Feign : vérifier existence du project
        if (dto.getProjectId() != null) {
            ProjectDTO project = projectClient.getProjectById(dto.getProjectId());
            if (project == null) throw new RuntimeException("Project not found with Feign");
            imputation.setProjectId(project.getProjectId());
        } else {
            imputation.setProjectId(null);
        }

        // Feign : vérifier existence de la task
        if (dto.getTaskId() != null) {
            TaskDTO1 task = projectClient.getTaskById(dto.getTaskId());
            if (task == null) throw new RuntimeException("Task not found with Feign");
            imputation.setTaskId(task.getTaskId());
        } else {
            imputation.setTaskId(null);
        }

        Imputation saved = repository.save(imputation);
        return toDTO(saved);
    }

    @Transactional
    public ImputationDTO update(Long id, ImputationDTO dto) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Imputation not found with id: " + id);
        }

        Imputation entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Imputation not found with id: " + id));

        entity.setDate(dto.getDate());
        entity.setHours(dto.getHours());
        entity.setStartedTime(dto.getStartedTime());
        entity.setEndTime(dto.getEndTime());
        entity.setDescription(dto.getDescription());
        entity.setValidee(dto.isValide());
        entity.setDraft(dto.isDraft());

        if (dto.getProjectId() != null) {
            ProjectDTO project = projectClient.getProjectById(dto.getProjectId());
            if (project == null) throw new RuntimeException("Project not found with Feign");
            entity.setProjectId(project.getProjectId());
        } else {
            entity.setProjectId(null);
        }

        if (dto.getTaskId() != null) {
            TaskDTO1 task = projectClient.getTaskById(dto.getTaskId());
            if (task == null) throw new RuntimeException("Task not found with Feign");
            entity.setTaskId(task.getTaskId());
        } else {
            entity.setTaskId(null);
        }

        return toDTO(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Imputation not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public ImputationDTO toDTO(Imputation entity) {
        ImputationDTO dto = new ImputationDTO();
        dto.setImputationId(entity.getImputationId());
        dto.setDate(entity.getDate());
        dto.setHours(entity.getHours());
        dto.setStartedTime(entity.getStartedTime());
        dto.setEndTime(entity.getEndTime());
        dto.setProjectId(entity.getProjectId());
        dto.setTaskId(entity.getTaskId());
        dto.setValide(entity.isValidee());
        dto.setDraft(entity.isDraft());
        dto.setDescription(entity.getDescription());
        dto.setUserId(entity.getEmployee() != null ? entity.getEmployee().getId() : null);
        return dto;
    }

    public void markAsDraft(Long id) {
        Imputation imputation = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imputation not found"));
        imputation.setDraft(true);
        repository.save(imputation);
    }

    @Transactional
    public void updateImputationDescription(Long imputationId, String newDescription) {
        Imputation imputation = repository.findById(imputationId)
                .orElseThrow(() -> new EntityNotFoundException("Imputation not found with id: " + imputationId));
        imputation.setDescription(newDescription);
        repository.save(imputation);
    }

    @Transactional
    public void validateImputation(Long id) {
        Imputation imputation = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Imputation not found with id: " + id));
        imputation.setValidee(true);
        imputation.setDraft(false);
        repository.save(imputation);
    }
}
