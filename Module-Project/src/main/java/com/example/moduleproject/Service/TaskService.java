package com.example.moduleproject.Service;

import com.example.moduleproject.Repository.*;
import com.example.moduleproject.dto.EmployeCreateDTO;
import com.example.moduleproject.dto.TaskActualTimeUpdateDTO;

import com.example.moduleproject.dto.TaskDTO1;
import com.example.moduleproject.entity.*;
import com.example.moduleproject.exception.ResourceNotFoundException;
import com.example.moduleproject.feign.EmployeClient;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepo;
    @Autowired
    private EmployeClient employeeRepo;
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private PhaseRepository phaseRepo;
    @Autowired
    private UserRepository userRepository ;
    @Autowired
    CommentRepository commentRepo ;
    public List<TaskDTO1> getAll() {
        return taskRepo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }
    @PersistenceContext
    private EntityManager entityManager;


    public List<TaskDTO1> getByPhaseId(Long phaseId) {
        return taskRepo.findByPhase_PhaseId(phaseId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public TaskDTO1 getById(Long id) {
        return toDto(taskRepo.findById(id).orElseThrow());
    }

    public long countByPhaseId(Long phaseId) {
        return taskRepo.countByPhase_PhaseId(phaseId);
    }

    public TaskDTO1 create(TaskDTO1 dto) {
        if (dto.getPhaseId() == null) {
            throw new IllegalArgumentException("Phase ID must not be null.");
        }

        Phase phase = phaseRepo.findById(dto.getPhaseId())
                .orElseThrow(() -> new IllegalArgumentException("No phase found with ID: " + dto.getPhaseId()));

        if (dto.getEstimatedTime() > phase.getTotalHours()) {
            throw new IllegalArgumentException("Not enough available hours in the selected phase.");
        }

        Task task = new Task();
        task.setName(dto.getName());
        task.setDescription(dto.getDescription());
        task.setEstimatedTime(dto.getEstimatedTime());
        task.setActualTime(dto.getActualTime());
        task.setPriority(dto.getPriority());
        task.setStatus(dto.getStatus());
        task.setCreatedDate(LocalDateTime.now());
        task.setJiraKey(dto.getJiraKey());
        if (dto.getStartDate() != null) {
            task.setCreatedDate(dto.getStartDate().atStartOfDay());
        }
        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Projet introuvable"));
            task.setProject(project);
        }
        if (dto.getDueDate() != null) {
            task.setDueDate(dto.getDueDate());
        }

        if (dto.getReporterId() != null) {

            EmployeCreateDTO empDto = employeeRepo.getEmployeById(dto.getReporterId());
            Employe reporter = empDto.toEntity();
            task.setReporter(reporter);
        }

        if (dto.getAssigneeId() != null) {
            EmployeCreateDTO empDto = employeeRepo.getEmployeById(dto.getAssigneeId());
            Employe assignee = empDto.toEntity() ;
            task.setAssignee(assignee);
        }

        // ✅ Phase
        task.setPhase(phase);

        // ✅ Labels
        if (dto.getLabels() != null) {
            task.setLabels(dto.getLabels());
        }

        // ✅ Tâche parente locale (si `parentTaskId` est fourni)
        if (dto.getParentTaskId() != null) {
            Task parent = taskRepo.findById(dto.getParentTaskId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent task not found with ID: " + dto.getParentTaskId()));
            task.setParentTask(parent);
        }
        if (dto.getComment() != null && dto.getComment().getContent() != null) {
            Comment comment = new Comment();
            comment.setContent(dto.getComment().getContent());
            comment.setCreatedDate(LocalDateTime.now());

            if (dto.getComment().getAuthorId() != null) {
                User author = userRepository.findById(dto.getComment().getAuthorId())
                        .orElseThrow(() -> new IllegalArgumentException("Author not found"));
                comment.setAuthor(author);
            }

            comment.setTask(task); // 🔗 très important
            commentRepo.save(comment); // ⬅️ enregistre le commentaire
        }


        // 🔄 Sauvegarde tâche
        task = taskRepo.save(task);

        // ✅ Enregistrer un commentaire s'il existe
        if (dto.getComment() != null && dto.getComment().getContent() != null) {
            Comment comment = new Comment();
            comment.setContent(dto.getComment().getContent());
            comment.setCreatedDate(LocalDateTime.now());
            comment.setTask(task);

            if (dto.getComment().getAuthorId() != null) {
                EmployeCreateDTO empDto = employeeRepo.getEmployeById(dto.getComment().getAuthorId());
                Employe employe = empDto.toEntity() ;
              if (employe != null)    {
              comment.setAuthor(employe);


              }}

            commentRepo.save(comment);
        }

        return toDto(task);
    }


    public TaskDTO1 update(Long id, TaskDTO1 dto) {
        Task task = taskRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));

        task.setName(dto.getName());
        task.setDescription(dto.getDescription());
        task.setEstimatedTime(dto.getEstimatedTime());
        task.setActualTime(dto.getActualTime());
        task.setPriority(dto.getPriority());
        task.setStatus(dto.getStatus());
        task.setDueDate(dto.getDueDate());

        if (dto.getAssigneeId() != null) {
            User assignee = userRepository.findById(dto.getAssigneeId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + dto.getAssigneeId()));
            task.setAssignee(assignee);
        }

        return toDto(taskRepo.save(task));
    }

    public void delete(Long id) {
        taskRepo.deleteById(id);
    }
    private TaskDTO1 toDto(Task t) {
        TaskDTO1 dto = new TaskDTO1();

        dto.setTaskId(t.getTaskId());
        dto.setName(t.getName());
        dto.setDescription(t.getDescription());
        dto.setEstimatedTime(t.getEstimatedTime());
        dto.setActualTime(t.getActualTime());
        dto.setPriority(t.getPriority());
        dto.setStatus(t.getStatus());
        dto.setCreatedDate(t.getCreatedDate());
        dto.setDueDate(t.getDueDate());
        dto.setUpdatedDate(t.getUpdatedDate());
        dto.setUpdatedBy(t.getUpdatedBy());
        dto.setJiraKey(t.getJiraKey());

        // Phase
        dto.setPhaseId(t.getPhase() != null ? t.getPhase().getPhaseId() : null);

        // Assignee & Reporter
        dto.setAssigneeId(t.getAssignee() != null ? t.getAssignee().getId() : null);
        dto.setReporterId(t.getReporter() != null ? t.getReporter().getId() : null);

        // Parent Task
        dto.setParentTaskId(t.getParentTask() != null ? t.getParentTask().getTaskId() : null);

        // Sub Tasks
        dto.setSubTaskIds(
                t.getSubTasks() != null
                        ? t.getSubTasks().stream().map(Task::getTaskId).collect(Collectors.toList())
                        : null
        );

        // Labels
        dto.setLabels(t.getLabels());

        // Linked Tasks

        return dto;
    }
    public List<TaskDTO1> getRootTasksByPhaseId(Long phaseId) {
        return taskRepo.findByPhase_PhaseIdAndParentTaskIsNull(phaseId)
                .stream()
                .map(this::toDto) // si tu as un mapper, sinon map manuellement
                .toList();
    }

    public List<TaskDTO1> getSubTasks(Long parentTaskId) {
        return taskRepo.findByParentTask_TaskId(parentTaskId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public boolean existsByJiraKey(String jiraKey) {
        return taskRepo.findByJiraKey(jiraKey).isPresent();
    }
    public Optional<Task> getByJiraKey(String jiraKey) {
        return taskRepo.findByJiraKey(jiraKey);
    }
    public Task findById(Long id) {
        return taskRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + id));
    }

    // Method to update the task
    public Task updateActualTime(Long id, TaskActualTimeUpdateDTO updateDTO) {
        Task task = findById(id);
        task.setActualTime(updateDTO.getActualTime());
        return taskRepo.save(task);
    }
    public List<TaskDTO1> getByProjectId(Long projectId) {
        return taskRepo.findByProject_projectIdAndPhaseIsNull(projectId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public TaskDTO1 convertToDTO(Task task) {
        if (task == null) {
            return null;
        }

        TaskDTO1 dto = new TaskDTO1();
        dto.setTaskId(task.getTaskId());
        dto.setName(task.getName());
        dto.setDescription(task.getDescription());
        dto.setEstimatedTime(task.getEstimatedTime());
        dto.setActualTime(task.getActualTime());
       // dto.setStartDate(task.getCreatedDate());
       // dto.setAssigneeEmail(task.getAssignee().getEmail());
        dto.setJiraKey(task.getJiraKey());
      //  dto.setAssigneeId(task.getAssignee().getId());
        // Set other fields as necessary
        dto.setPriority(task.getPriority());
        dto.setStatus(task.getStatus());
        dto.setCreatedDate(task.getCreatedDate());
        dto.setDueDate(task.getDueDate());
        dto.setUpdatedDate(task.getUpdatedDate());
        dto.setUpdatedBy(task.getUpdatedBy());
        dto.setPhaseId(task.getPhase().getPhaseId());
    //    dto.setParentTaskId(task.getParentTask().getTaskId());
        //dto.setSubTaskIds(task.getSubTasks());
       // dto.setLabels(task.getLabels());

        return dto;
    }
}
