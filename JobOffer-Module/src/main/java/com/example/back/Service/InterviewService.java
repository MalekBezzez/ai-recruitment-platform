package com.example.back.Service;


import com.example.back.Repository.InterviewRepository;
import com.example.back.Repository.InterviewSpecification;
import com.example.back.dto.*;
import com.example.back.entity.Application;
import com.example.back.entity.Employe;
import com.example.back.entity.Interview;
import com.example.back.entity.Room;
import com.example.back.feign.EmployerClient;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;




@Service
@RequiredArgsConstructor
public class InterviewService {
    private final InterviewRepository interviewRepository;
    private final ApplicationService applicationService;

    private final RoomService roomService;

    private final EmployerClient employeeClient; //

    public Interview saveInterview(Interview interview) {
        return interviewRepository.save(interview);
    }

    public Interview getInterviewById(Long id) {
        return interviewRepository.findById(id).orElse(null);
    }

    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }

    public void deleteInterview(Long id) {
        interviewRepository.deleteById(id);
    }

    public Interview updateInterview(Interview interview) {
        return interviewRepository.save(interview);
    }

    public List<Interview> getInterviewsByApplicationId(Long applicationId) {
        return interviewRepository.findByApplication_Id(applicationId);
    }

    public Interview scheduleInterview(ScheduleInterviewRequestDTO dto) {
        Interview interview = new Interview();

        interview.setTitle(dto.title());
        interview.setScheduledDateTime(dto.datetime());
        interview.setDuration(dto.duration());
        interview.setMeetingLink(dto.meetingLink());
        interview.setStatus(Interview.InterviewStatus.SCHEDULED);

        // Lier l'application
        Application application = applicationService.getApplicationById(dto.applicationId());
        interview.setApplication(application);

        // Lier la salle si présent
        if (dto.roomId() != null) {
            Room room = roomService.getRoomById(dto.roomId());
            interview.setRoom(room);
        }

        List<Employe> interviewers = dto.interviewers().stream()
                .map(id -> {
                    EmployeeLightDTO dtoEmp = employeeClient.getEmployeById(id);
                    if (dtoEmp == null) return null;

                    Employe emp = new Employe();
                    emp.setId(dtoEmp.id());
                    emp.setFirstname(dtoEmp.firstname());
                    emp.setLastname(dtoEmp.lastname());
                    return emp;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        interview.setInterviewers(interviewers);

        return interviewRepository.save(interview);
        // future add mailing functionnality
    }




    public InterviewResponseDTO getInterviewDtoById(Long id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Interview not found with id " + id));

        // ✅ Convertir List<Employe> → List<Long> (IDs uniquement)
        List<Long> interviewerIds = interview.getInterviewers().stream()
                .map(Employe::getId)
                .collect(Collectors.toList());


        return new InterviewResponseDTO(
                interview.getId(),
                interview.getTitle(),
                interview.getScheduledDateTime(),
                interview.getDuration(),
                interview.getMeetingLink(),
                (interview.getRoom() != null && interview.getRoom().getSite() != null)
                        ? interview.getRoom().getSite().getId()
                        : null,
                interview.getRoom() != null ? interview.getRoom().getId() : null,
                interviewerIds // ✅ On utilise directement la liste d'IDs
        );
    }


    public InterviewResponseDTO updateInterview(Long idInterview, ScheduleInterviewRequestDTO dto) {
        Interview interview = interviewRepository.findById(idInterview)
                .orElseThrow(() -> new EntityNotFoundException("Interview not found with id " + idInterview));

        // Mettre à jour les champs
        interview.setTitle(dto.title());
        interview.setScheduledDateTime(dto.datetime());
        interview.setDuration(dto.duration());
        interview.setMeetingLink(dto.meetingLink());

        // Modifier le status à RESCHEDULED
        interview.setStatus(Interview.InterviewStatus.RESCHEDULED);

        // Récupérer la salle
        Room room = roomService.getRoomById(dto.roomId());
        interview.setRoom(room);

        // Récupérer les interviewers via Feign
        List<Employe> interviewers = dto.interviewers().stream()
                .map(id -> {
                    EmployeeLightDTO dtoEmp = employeeClient.getEmployeById(id);
                    if (dtoEmp == null) return null;

                    Employe emp = new Employe();
                    emp.setId(dtoEmp.id());
                    emp.setFirstname(dtoEmp.firstname());
                    emp.setLastname(dtoEmp.lastname());
                    return emp;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        interview.setInterviewers(interviewers);

        // Sauvegarde
        interviewRepository.save(interview);

        return new InterviewResponseDTO(
                interview.getId(),
                interview.getTitle(),
                interview.getScheduledDateTime(),
                interview.getDuration(),
                interview.getMeetingLink(),
                interview.getRoom().getSite() != null ? interview.getRoom().getSite().getId() : null,
                interview.getRoom().getId(),
                dto.interviewers()
        );
    }


    @Transactional
    public void updateInterviewStatus(Long interviewId, UpdateInterviewStatusRequestDTO dto) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new EntityNotFoundException("Interview not found with id " + interviewId));

        Interview.InterviewStatus newStatus = Arrays.stream(Interview.InterviewStatus.values())
                .filter(status -> status.getLabel().equalsIgnoreCase(dto.label()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid status label: " + dto.label()));

        interview.setStatus(newStatus);
        interviewRepository.save(interview);
    }



// Must add the emailing logic after
// what i recently added

    public List<InterviewDTO> getAllInterviewsDTO() {
        List<Interview> interviewsList = getAllInterviews();

        return interviewsList.stream().map(interview -> {
            // ✅ Récupérer les interviewers via Feign à partir de la relation ManyToMany
            List<EmployeeInterviewerDTO> interviewerDTOs = interview.getInterviewers()
                    .stream()
                    .map(employe -> {
                        try {
                            EmployeeLightDTO emp = employeeClient.getEmployeById(employe.getId());
                            return new EmployeeInterviewerDTO(
                                    emp.id(),
                                    emp.firstname() + " " + emp.lastname()
                            );
                        } catch (Exception e) {
                            // Si le microservice employé est indisponible, on met "Inconnu"
                            return new EmployeeInterviewerDTO(employe.getId(), "Inconnu");
                        }
                    })
                    .collect(Collectors.toList());

            return new InterviewDTO(
                    interview.getId(),
                    interview.getTitle(),
                    interview.getScheduledDateTime(),
                    interview.getDuration(),
                    interview.getMeetingLink(),
                    interview.getStatus().getLabel(),
                    interview.getRoom() != null ? interview.getRoom().getName() : null,
                    interviewerDTOs
            );
        }).collect(Collectors.toList());
    }



    public List<InterviewDTO> getInterviewsDTOByApplicationId(Long applicationId) {
        // Récupère les interviews liés à une application spécifique
        List<Interview> interviewsList = interviewRepository.findByApplicationId(applicationId);

        return interviewsList.stream().map(interview -> {
            // ✅ Utilisation du Feign Client pour récupérer les détails des interviewers
            List<EmployeeInterviewerDTO> interviewerDTOs = interview.getInterviewers()
                    .stream()
                    .map(employe -> {
                        try {
                            EmployeeLightDTO emp = employeeClient.getEmployeById(employe.getId());
                            return new EmployeeInterviewerDTO(
                                    emp.id(),
                                    emp.firstname() + " " + emp.lastname()
                            );
                        } catch (Exception e) {
                            return new EmployeeInterviewerDTO(employe.getId(), "Inconnu");
                        }
                    })
                    .collect(Collectors.toList());

            return new InterviewDTO(
                    interview.getId(),
                    interview.getTitle(),
                    interview.getScheduledDateTime(),
                    interview.getDuration(),
                    interview.getMeetingLink(),
                    interview.getStatus().getLabel()    ,
                    interview.getRoom() != null ? interview.getRoom().getName() : null,
                    interviewerDTOs
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public List<InterviewDetailsDTO> getAllInterviewDetails() {
        List<Interview> interviews = interviewRepository.findAll();

        return interviews.stream().map(interview -> {
            // ✅ Récupérer les interviewers via Feign client
            List<EmployeeInterviewerDTO> interviewerDTOs = interview.getInterviewers()
                    .stream()
                    .map(employe -> {
                        try {
                            EmployeeLightDTO emp = employeeClient.getEmployeById(employe.getId());
                            return new EmployeeInterviewerDTO(
                                    emp.id(),
                                    emp.firstname() + " " + emp.lastname()
                            );
                        } catch (Exception e) {
                            return new EmployeeInterviewerDTO(employe.getId(), "Inconnu");
                        }
                    })
                    .collect(Collectors.toList());



            Application application = interview.getApplication();
            String applicant = application.getName();

            // Titre du poste selon type de candidature
            String jobTitle;
            String applicationType;

            if (application.getJobOffer() != null) {
                jobTitle = application.getJobOffer().getJobTitle();
                applicationType = "By offer";
            } else {
                jobTitle = application.getSpontaneousJobTitle();
                applicationType = "Spontaneous";
            }


            return new InterviewDetailsDTO(
                    interview.getId(),
                    interview.getTitle(),
                    interview.getScheduledDateTime(),
                    interview.getDuration(),
                    interview.getRoom() != null ? interview.getRoom().getName() : null,
                    interview.getMeetingLink(),
                    interview.getStatus().getLabel(),
                    jobTitle,
                    application.getId(),
                    applicant ,
                    application.getEmail(),
                    application.getMobilePhone(),
                    interviewerDTOs,
                    applicationType
            );
        }).collect(Collectors.toList());
    }




    public List<InterviewDetailsDTO> filterInterviews(InterviewFilterDTO filter) {
  // a verifier ceci (sprcification class)
        List<Interview> filteredInterviews = interviewRepository.findAll(
                InterviewSpecification.filterBy(filter) // retourne liste d'interviews selon filterong criteria
        );


        return filteredInterviews.stream().map(interview -> {
            // ✅ Récupération des interviewers via leurs entités Employe
            List<EmployeeInterviewerDTO> interviewerDTOs = interview.getInterviewers()
                    .stream()
                    .map(employe -> {
                        try {
                            EmployeeLightDTO emp = employeeClient.getEmployeById(employe.getId());
                            return new EmployeeInterviewerDTO(
                                    emp.id(),
                                    emp.firstname() + " " + emp.lastname()
                            );
                        } catch (Exception e) {
                            // En cas d’erreur (microservice employé indisponible)
                            return new EmployeeInterviewerDTO(employe.getId(), "Inconnu");
                        }
                    })
                    .collect(Collectors.toList());

            Application application = interview.getApplication();
            String applicant = application.getName();

            // 🎯 Gestion du type de candidature
            String jobTitle;
            String applicationType;
            if (application.getJobOffer() != null) {
                jobTitle = application.getJobOffer().getJobTitle();
                applicationType = "By offer";
            } else {
                jobTitle = application.getSpontaneousJobTitle();
                applicationType = "Spontaneous";
            }



            return new InterviewDetailsDTO(
                    interview.getId(),
                    interview.getTitle(),
                    interview.getScheduledDateTime(),
                    interview.getDuration(),
                    interview.getRoom() != null ? interview.getRoom().getName() : null,
                    interview.getMeetingLink(),
                    interview.getStatus().getLabel(),
                    jobTitle,
                    application.getId(),
                    applicant,
                    application.getEmail(),
                    application.getMobilePhone(),
                    interviewerDTOs,
                    applicationType
            );
        }).collect(Collectors.toList());
    }




}
