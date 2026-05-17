package com.example.moduleproject.Service;

import com.example.moduleproject.dto.PhaseDTO;
import com.example.moduleproject.dto.TaskDTO1;
import com.example.moduleproject.entity.Phase;
import com.example.moduleproject.entity.Project;
import com.example.moduleproject.entity.Task;
import com.example.moduleproject.Repository.PhaseRepository;
import com.example.moduleproject.Repository.ProjectRepository;
import com.example.moduleproject.Repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PhaseService {

    @Autowired
    private PhaseRepository phaseRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<PhaseDTO> getAll() {
        return phaseRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<PhaseDTO> getByProjectId(Long projectId) {
        return phaseRepository.findByProject_ProjectId(projectId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public PhaseDTO getById(Long id) {
        return toDto(phaseRepository.findById(id).orElseThrow());
    }
    public PhaseDTO update(Long id, PhaseDTO dto) {
        Phase existingPhase = phaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Phase not found with id: " + id));

        existingPhase.setName(dto.getName());
        existingPhase.setDescription(dto.getDescription());
        existingPhase.setStartedDate(dto.getStartedDate());
        existingPhase.setEndDate(dto.getEndDate());
        existingPhase.setTotalHours(dto.getTotalHours());


        Phase updatedPhase = phaseRepository.save(existingPhase);
        return toDto(updatedPhase);
    }
    public PhaseDTO create(PhaseDTO dto) {
        Phase phase = new Phase();
        phase.setName(dto.getName());
        phase.setDescription(dto.getDescription());
        phase.setStartedDate(dto.getStartedDate());
        phase.setEndDate(dto.getEndDate());
        phase.setTotalHours(dto.getTotalHours());

        Project project = projectRepository.findById(dto.getProjectId()).orElseThrow();
        phase.setProject(project);

        return toDto(phaseRepository.save(phase));
    }


    public void delete(Long id) {
        phaseRepository.deleteById(id);
    }

    private PhaseDTO toDto(Phase phase) {
        PhaseDTO dto = new PhaseDTO();
        dto.setPhaseId(phase.getPhaseId());
        dto.setName(phase.getName());
        dto.setDescription(phase.getDescription());
        dto.setStartedDate(phase.getStartedDate());
        dto.setEndDate(phase.getEndDate());
        dto.setTotalHours(phase.getTotalHours());
        dto.setProjectId(phase.getProject().getProjectId());

        // Ajout des tâches liées à cette phase
        List<TaskDTO1> tasks = taskRepository.findByPhase_PhaseId(phase.getPhaseId())
                .stream()
                .map(this::toTaskDto)
                .collect(Collectors.toList());

        dto.setTasks(tasks);

        return dto;
    }

    private TaskDTO1 toTaskDto(Task task) {
        TaskDTO1 dto = new TaskDTO1();
        dto.setTaskId(task.getTaskId());
        dto.setName(task.getName());
        dto.setEstimatedTime(task.getEstimatedTime());
        dto.setActualTime(task.getActualTime());
        dto.setPriority(task.getPriority());
        dto.setPhaseId(task.getPhase().getPhaseId());
        return dto;
    }
}
