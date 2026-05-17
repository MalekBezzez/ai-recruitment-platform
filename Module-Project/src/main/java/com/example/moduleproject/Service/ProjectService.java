package com.example.moduleproject.Service;

import com.example.moduleproject.Repository.ProjectRepository;
import com.example.moduleproject.Service.ClientService;
import com.example.moduleproject.dto.ProjectDTO;
import com.example.moduleproject.dto.ProjectNameIdDTO;
import com.example.moduleproject.entity.Client;
import com.example.moduleproject.entity.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepo;

    @Autowired
    private ClientService clientService;

    public List<ProjectDTO> getAll() {
        return projectRepo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public ProjectDTO getById(Long id) {
        return toDto(projectRepo.findById(id).orElseThrow());
    }

    public void delete(Long id) {
        projectRepo.deleteById(id);
    }
    public Optional<Project> getProjectWithTasks(Long id) {
        return projectRepo.findById(id);
    }

    public ProjectDTO create(ProjectDTO dto) {
        Project p = new Project();
        p.setName(dto.getName());
        p.setStartedDate(dto.getStartedDate());
        p.setEndDate(dto.getEndDate());
        p.setTotalHours(dto.getTotalHours());

        // Associer le client
        Client client = clientService.getEntityById(dto.getClientId());

        p.setClient(client);

        return toDto(projectRepo.save(p));
    }

    private ProjectDTO toDto(Project p) {
        ProjectDTO dto = new ProjectDTO();
        dto.setProjectId(p.getProjectId());
        dto.setName(p.getName());
        dto.setStartedDate(p.getStartedDate());
        dto.setEndDate(p.getEndDate());
        dto.setTotalHours(p.getTotalHours());
        if (p.getClient() != null) {
            dto.setClientId(p.getClient().getClientId());

        }
        return dto;
    }


    public List<ProjectNameIdDTO> getAllProjectNamesAndIds() {
        return projectRepo.findAll()
                .stream()
                .map(project -> new ProjectNameIdDTO(project.getProjectId(), project.getName()))
                .collect(Collectors.toList());
    }
    public ProjectDTO update(Long id, ProjectDTO dto) {
        Project existingProject = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'id : " + id));

        existingProject.setName(dto.getName());
        existingProject.setStartedDate(dto.getStartedDate());
        existingProject.setEndDate(dto.getEndDate());
        existingProject.setTotalHours(dto.getTotalHours());

        // Mise à jour du client si besoin
        if (dto.getClientId() != null) {
            Client client = clientService.getEntityById(dto.getClientId());
            existingProject.setClient(client);
        }

        return toDto(projectRepo.save(existingProject));
    }
    @Transactional
    public ProjectDTO getOrCreateAbsenceProject() {
        Project project = projectRepo.findByName("Absence").orElseGet(() -> {
            Project absenceProject = new Project();
            absenceProject.setName("Absence");
            absenceProject.setStartedDate(LocalDate.now());
            absenceProject.setEndDate(null); // long projet absence
            absenceProject.setTotalHours(100000); // arbitraire mais très large
            return projectRepo.save(absenceProject);
        });
        return toDto(project);
    }

}
