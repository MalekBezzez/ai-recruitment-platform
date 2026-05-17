package com.example.back.Service;


import com.example.back.Repository.ApplicationRepository;
import com.example.back.Repository.ApplicationSpecification;
import com.example.back.dto.*;
import com.example.back.entity.Application;
import com.example.back.entity.Matches;
import com.example.back.entity.Resume;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {


    private final ApplicationRepository applicationRepository;


    public Application saveApplication(Application application) {
        return applicationRepository.save(application);
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id).orElse(null);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }

    public Application updateApplication(Application application) {
        return applicationRepository.save(application);
    }


    public List<Application> getApplicationsByJobOfferId(Long jobOfferId) {
        return applicationRepository.findByJobOffer_Id(jobOfferId);
    }


    public List<ApplicationResponseDTO> getApplicationsByJobOffer(Long offerId) {
        List<Application> applications = applicationRepository.findByJobOffer_Id(offerId);

        return applications.stream()
                .map(app -> {

                    String fullName = app.getName();
                    // Getting final Score
                    Double matchingScore = (app.getMatch() != null )
                            ? app.getMatch().getFinalScore().doubleValue()
                            : null;
                    // Getting CV
                    String cvBase64 = (app.getCvFile() != null)
                            ? Base64.getEncoder().encodeToString(app.getCvFile())
                            : null;

                    return new ApplicationResponseDTO(
                            app.getId(),
                            fullName,
                            app.getMobilePhone(),
                            app.getEmail(),
                            app.getApplicationDate(),
                            app.getApplicationStatus(),
                            matchingScore,
                            cvBase64
                    );
                })
                .toList();
    }





    public ScoreDetailsDTO getScoreDetails(Long applicationId) {  // we pass applicationId
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Resume resume = app.getResume();
        Matches match = app.getMatch();

        // formatting
        if (match == null) {
            throw new RuntimeException("No matching information found for this application");
        }

        DateFormat dateFormat = new SimpleDateFormat("MMM yyyy");

        // Experience
        List<String> experienceList = resume.getExperiences().stream()
                .map(exp -> String.format(
                        "Title: %s\nCompany: %s\nStart Date: %s\nEnd Date: %s\nType: %s\nDescription: %s",
                        exp.getTitle() != null ? exp.getTitle() : "N/A",
                        exp.getCompany() != null ? exp.getCompany() : "N/A",
                        exp.getStartDateText() != null && !exp.getStartDateText().isBlank() ? exp.getStartDateText() : "N/A",
                        exp.getEndDateText() != null && !exp.getEndDateText().isBlank() ? exp.getEndDateText() : "N/A",
                        exp.getType() != null ? exp.getType() : "N/A",
                        exp.getDescription() != null ? exp.getDescription() : "N/A"
                ))
                .collect(Collectors.toList());

        // Education

        List<String> educationList = resume.getEducations().stream()
                .map(edu -> String.format(
                        "Degree: %s\nInstitution: %s\nStart Date: %s\nEnd Date: %s",
                        edu.getDegree() != null ? edu.getDegree() : "N/A",
                        edu.getInstitution() != null ? edu.getInstitution() : "N/A",
                        edu.getStartDateText() != null && !edu.getStartDateText().isBlank() ? edu.getStartDateText() : "N/A",
                        edu.getEndDateText() != null && !edu.getEndDateText().isBlank() ? edu.getEndDateText() : "N/A"
                ))
                .collect(Collectors.toList());

        // Certification
        List<String> certificationList = resume.getCertifications().stream()
                .map(cert -> String.format(
                        "Certification: %s\nDate: %s",
                        cert.getName() != null ? cert.getName() : "N/A",
                        cert.getDateText() != null && !cert.getDateText().isBlank() ? cert.getDateText() : "N/A"
                ))
                .collect(Collectors.toList());


        // Skills
        List<String> skillList = resume.getSkills().stream()
                .map(skill -> String.format(
                        "%s",
                        skill.getName() != null ? skill.getName() : "N/A"
                ))
                .collect(Collectors.toList());

        // Languages
        List<String> languageList = resume.getLanguages().stream()
                .map(lang -> String.format(
                        "Language: %s — Level: %s",
                        lang.getName() != null ? lang.getName() : "N/A",
                        lang.getLevel() != null ? lang.getLevel() : "N/A"
                ))
                .collect(Collectors.toList());


        // Links
        List<String> linkList = resume.getLinks().stream()
                .map(link -> String.format(
                        "Link: %s",
                        link.getLink() != null ? link.getLink() : "N/A"
                ))
                .collect(Collectors.toList());

        return new ScoreDetailsDTO(
                match.getSkillsScore().doubleValue(),
                match.getExperienceScore().doubleValue(),
                match.getEducationScore().doubleValue(),
                match.getLanguageScore().doubleValue(),
                match.getCertificationScore().doubleValue(),
                match.getFinalScore().doubleValue(),
                match.getJustification(),

                resume.getName(),
                resume.getEmail(),
                resume.getPhone(),
                resume.getYearsOfExperience(),
                skillList,
                languageList,
                certificationList,
                educationList,
                experienceList,
                linkList
        );


    }

    public int countApplicationsByOfferId(Long offerId) {
        return applicationRepository.countByJobOffer_Id(offerId);
    }


    //what i added 11/06

    public Application updateApplicationStatus(Long applicationId, String newStatus) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setApplicationStatus(newStatus); // ou `setStatus`, selon ton modèle
        return applicationRepository.save(application);
    }

    //what malek added 12/06

    public InterviewPlanningInfoDTO getInterviewPlanningInfo(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + applicationId));

        String applicantName = application.getName();
        String jobTitle = application.getJobOffer().getJobTitle();

        return new InterviewPlanningInfoDTO(applicantName, jobTitle);
    }

/*
    public List<AllApplicationsResponseDTO> getAllApplicationsDTO() {
        List<Application> applications = applicationRepository.findAll();

        return applications.stream().map(app -> {
            String fullName = app.getName();

            String jobTitle;
            String applicationType;
            if (app.getJobOffer() != null) {
                jobTitle = app.getJobOffer().getJobTitle();
                applicationType = "By offer";
            } else {
                jobTitle = app.getSpontaneousJobTitle();
                applicationType = "Spontaneous";
            }

            String cvBase64 = app.getCvFile() != null
                    ? Base64.getEncoder().encodeToString(app.getCvFile())
                    : null;

            // ✅ Éviter NullPointerException
            Double matchingScore = app.getMatch() != null && app.getMatch().getFinalScore() != null
                    ? app.getMatch().getFinalScore().doubleValue()
                    : null;

            return new AllApplicationsResponseDTO(
                    app.getId(),
                    fullName,
                    app.getEmail(),
                    app.getMobilePhone(),
                    cvBase64,
                    app.getApplicationDate(),
                    app.getApplicationStatus(),
                    matchingScore, // ✅ Null-safe
                    jobTitle,
                    applicationType
            );
        }).collect(Collectors.toList());

    }
    /*
 */

    public List<AllApplicationsResponseDTO> getAllApplicationsDTO() {
        List<Application> applications = applicationRepository.findAll();

        return applications.stream()
                // ✅ Filtrer les statuts "PENDING_PARSING"
                .filter(app -> !"PENDING_PARSING".equalsIgnoreCase(app.getApplicationStatus()))
                .map(app -> {
                    String fullName = app.getName();

                    String jobTitle;
                    String applicationType;
                    if (app.getJobOffer() != null) {
                        jobTitle = app.getJobOffer().getJobTitle();
                        applicationType = "By offer";
                    } else {
                        jobTitle = app.getSpontaneousJobTitle();
                        applicationType = "Spontaneous";
                    }

                    String cvBase64 = app.getCvFile() != null
                            ? Base64.getEncoder().encodeToString(app.getCvFile())
                            : null;

                    // ✅ Null-safe pour éviter NullPointerException
                    Double matchingScore = (app.getMatch() != null && app.getMatch().getFinalScore() != null)
                            ? app.getMatch().getFinalScore().doubleValue()
                            : null;

                    return new AllApplicationsResponseDTO(
                            app.getId(),
                            fullName,
                            app.getEmail(),
                            app.getMobilePhone(),
                            cvBase64,
                            app.getApplicationDate(),
                            app.getApplicationStatus(),
                            matchingScore,
                            jobTitle,
                            applicationType
                    );
                })
                .collect(Collectors.toList());
    }

    /*public List<AllApplicationsResponseDTO> getFilteredApplications(FilterApplicationDTO filterDTO) {

        // Récupération avec la specification
        List<Application> filteredApplications = applicationRepository.findAll(ApplicationSpecification.filterBy(filterDTO));

        // Transformation en DTO
        return filteredApplications.stream().map(app -> {
            String fullName = app.getName(); // ou app.getFirstName() + " " + app.getLastName() si séparé

            // Déterminer le titre du poste et le type
            String jobTitle;
            String applicationType;
            if (app.getJobOffer() != null) {
                jobTitle = app.getJobOffer().getJobTitle();
                applicationType = "By offer";
            } else {
                jobTitle = app.getSpontaneousJobTitle();
                applicationType = "Spontaneous";
            }

            // Encodage du CV
            String cvBase64 = app.getCvFile() != null
                    ? Base64.getEncoder().encodeToString(app.getCvFile())
                    : null;

            // Matching score : null si Spontané
            Double matchingScore = (app.getMatch() != null) ? app.getMatch().getFinalScore().doubleValue() : null;

            return new AllApplicationsResponseDTO(
                    app.getId(),
                    fullName,
                    app.getEmail(),
                    app.getMobilePhone(),
                    cvBase64,
                    app.getApplicationDate(),
                    app.getApplicationStatus(),
                    matchingScore,
                    jobTitle,
                    applicationType
            );
        }).collect(Collectors.toList());
    }


     */


    public List<AllApplicationsResponseDTO> getFilteredApplications(FilterApplicationDTO filterDTO) {

        // Récupération avec la specification
        List<Application> filteredApplications = applicationRepository.findAll(
                ApplicationSpecification.filterBy(filterDTO)
        );

        // Transformation en DTO avec filtrage du statut PENDING_PARSING
        return filteredApplications.stream()
                .filter(app -> !"PENDING_PARSING".equalsIgnoreCase(app.getApplicationStatus())) // ✅ Filtre ajouté
                .map(app -> {
                    String fullName = app.getName();

                    // Déterminer le titre du poste et le type
                    String jobTitle;
                    String applicationType;
                    if (app.getJobOffer() != null) {
                        jobTitle = app.getJobOffer().getJobTitle();
                        applicationType = "By offer";
                    } else {
                        jobTitle = app.getSpontaneousJobTitle();
                        applicationType = "Spontaneous";
                    }

                    // Encodage du CV
                    String cvBase64 = app.getCvFile() != null
                            ? Base64.getEncoder().encodeToString(app.getCvFile())
                            : null;

                    // Matching score : null si Spontané
                    Double matchingScore = (app.getMatch() != null && app.getMatch().getFinalScore() != null)
                            ? app.getMatch().getFinalScore().doubleValue()
                            : null;

                    return new AllApplicationsResponseDTO(
                            app.getId(),
                            fullName,
                            app.getEmail(),
                            app.getMobilePhone(),
                            cvBase64,
                            app.getApplicationDate(),
                            app.getApplicationStatus(),
                            matchingScore,
                            jobTitle,
                            applicationType
                    );
                })
                .collect(Collectors.toList());
    }

    /*
    public List<ApplicationResponseDTO> getFilteredApplicationsForJobOffer(FilterApplicationDTO filterDTO) {
        if (filterDTO.jobOfferId() == null) { // c'est evident
            throw new IllegalArgumentException("jobOfferId is required for specific filtering.");
        }

        List<Application> applications = applicationRepository.findAll(ApplicationSpecification.filterBy(filterDTO));

        return applications.stream().map(app -> {
            String fullName = app.getName(); // ou app.getFirstName() + " " + app.getLastName()

            String cvBase64 = app.getCvFile() != null
                    ? Base64.getEncoder().encodeToString(app.getCvFile())
                    : null;

            Double matchingScore = (app.getMatch() != null) ? app.getMatch().getFinalScore().doubleValue() : null;

            return new ApplicationResponseDTO(
                    app.getId(),
                    fullName,
                    app.getMobilePhone(),
                    app.getEmail(),
                    app.getApplicationDate(),
                    app.getApplicationStatus(),
                    matchingScore,
                    cvBase64
            );
        }).collect(Collectors.toList());
    }

     */

    public List<ApplicationResponseDTO> getFilteredApplicationsForJobOffer(FilterApplicationDTO filterDTO) {
        if (filterDTO.jobOfferId() == null) {
            throw new IllegalArgumentException("jobOfferId is required for specific filtering.");
        }

        List<Application> applications = applicationRepository.findAll(
                ApplicationSpecification.filterBy(filterDTO)
        );

        return applications.stream()
                .filter(app -> !"PENDING_PARSING".equalsIgnoreCase(app.getApplicationStatus())) // ✅ Filtre ajouté
                .map(app -> {
                    String fullName = app.getName();

                    String cvBase64 = app.getCvFile() != null
                            ? Base64.getEncoder().encodeToString(app.getCvFile())
                            : null;

                    Double matchingScore = (app.getMatch() != null && app.getMatch().getFinalScore() != null)
                            ? app.getMatch().getFinalScore().doubleValue()
                            : null;

                    return new ApplicationResponseDTO(
                            app.getId(),
                            fullName,
                            app.getMobilePhone(),
                            app.getEmail(),
                            app.getApplicationDate(),
                            app.getApplicationStatus(),
                            matchingScore,
                            cvBase64
                    );
                })
                .collect(Collectors.toList());
    }

    public byte[] getCvFileByApplicationId(Long id) {
        Application app = applicationRepository.findById(id).orElse(null);
        if (app == null || app.getCvFile() == null) {
            return null;
        }
        return app.getCvFile();
    }

}
