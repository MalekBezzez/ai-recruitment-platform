package com.example.back.Service;


import com.example.back.Repository.ApplicationRepository;
import com.example.back.Repository.MatchesRepository;
import com.example.back.Repository.ResumeRepository;
import com.example.back.dto.CvProcessingResultDTO;
import com.example.back.dto.OfferResponseDTO;
import com.example.back.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

@RequiredArgsConstructor
@Component
public class FileProcessor {

    private final OfferService offerService;
    private final DiplomaTypeService diplomaTypeService;
    private final RabbitMQSender rabbitMQSender;
    private final ApplicationService applicationService;
    private final ResumeRepository resumeRepository;
    private final MatchesRepository matchesRepository;
    private final ApplicationRepository applicationRepository;
    // Injecté pour sauvegarder l’Application

    public void processFile(File file, String sourceType) {
        int maxAttempts = 10;
        int attempts = 0;
        boolean fileRead = false;
        byte[] fileBytes = null;

        while (!fileRead && attempts < maxAttempts) {
            try {
                fileBytes = Files.readAllBytes(file.toPath());
                fileRead = true;
            } catch (IOException e) {
                attempts++;
                System.out.println("File locked or not ready yet, retrying (" + attempts + "/" + maxAttempts + ") for file: " + file.getName());
                try {
                    Thread.sleep(500);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }

        if (!fileRead) {
            System.err.println("Failed to read file after " + maxAttempts + " attempts: " + file.getAbsolutePath());
            return;
        }

        // Créer l’entité Application partielle
        Application application = new Application();
        application.setCvFile(fileBytes);
        application.setApplicationDate(new Date());
        application.setApplicationStatus("PENDING_PARSING");
        application.setEmail("");
        application.setName("");

        if ("SPONTANEOUS".equals(sourceType)) {
            application.setSpontaneousJobTitle("-"); // Chaîne vide pour candidatures spontanées
        } else if ("OFFER".equals(sourceType)) {
            String offerId = extractOfferId(file);
            if (offerId != null) {
                try {
                    Long offerIdLong = Long.parseLong(offerId);
                    OfferResponseDTO offerDTO = offerService.getOfferById(offerIdLong);
                    Offer offer = new Offer();
                    offer.setId(offerIdLong);
                    offer.setJobTitle(offerDTO.jobTitle());
                    // Autres champs si nécessaire
                    application.setJobOffer(offer);
                } catch ( Exception e) {
                    System.err.println("Invalid offer ID or error fetching offer: " + offerId);
                    return;
                }
            } else {
                System.err.println("Failed to extract offer ID from file: " + file.getName());
                return;
            }
        }

        // Sauvegarder l’entité Application pour obtenir l’ID
        Application savedApplication = applicationService.saveApplication(application);

        // Encoder le CV en base64 pour le module IA
        String base64Encoded = Base64.getEncoder().encodeToString(fileBytes);

        System.out.println("Processing file: " + file.getName());
        System.out.println("Source folder: " + sourceType);
        System.out.println("Base64 encoded (first 100 chars): " +
                base64Encoded.substring(0, Math.min(100, base64Encoded.length())) + "...");

        // Envoyer au module IA avec l’applicationId
        if ("SPONTANEOUS".equals(sourceType)) {
            handleSpontaneous(base64Encoded, savedApplication.getId());
        } else if ("OFFER".equals(sourceType)) {
            handleOffer(base64Encoded, file, savedApplication.getId());
        }
    }

    private void handleSpontaneous(String base64, Long applicationId) {
        Map<String, Object> finalPayload = new HashMap<>();
        finalPayload.put("cv_encoded", base64);
        finalPayload.put("applicationId", applicationId); // Ajout de l’ID

        rabbitMQSender.sendToCvParsingQueue(finalPayload);
    }

    private void handleOffer(String base64, File file, Long applicationId) {
        String offerId = extractOfferId(file);
        if (offerId == null) {
            System.err.println("Failed to extract offer ID from file: " + file.getName());
            return;
        }

        Map<String, Object> offerData = fetchOfferData(offerId);
        if (offerData == null) {
            System.err.println("Failed to fetch data for offer ID: " + offerId);
            return;
        }

        Map<String, Object> finalPayload = new HashMap<>();
        finalPayload.put("cv_encoded", base64);
        finalPayload.put("job_offer", offerData);
        finalPayload.put("applicationId", applicationId); // Ajout de l’ID

        rabbitMQSender.sendToCvParsingQueue(finalPayload);
    }

    private String extractOfferId(File file) {
        String filename = file.getName();
        int lastUnderscore = filename.lastIndexOf('_');
        int dot = filename.lastIndexOf('.');
        if (lastUnderscore != -1 && dot != -1 && lastUnderscore < dot) {
            return filename.substring(lastUnderscore + 1, dot); // ex: "CV-TEST_123.pdf" -> "123"
        }
        return null;
    }

    private Map<String, Object> fetchOfferData(String offerId) {
        Map<String, Object> offerData = new HashMap<>();
        try {
            Long offerIdLong = Long.parseLong(offerId);
            OfferResponseDTO offer = offerService.getOfferById(offerIdLong);
            offerData.put("job_offer_Id", offerId);
            offerData.put("job_title", offer.jobTitle());
            offerData.put("years_of_experience", offer.yearsOfExp().toString());
            Map<String, String> education = new HashMap<>();
            education.put("diploma_name", diplomaTypeService.getDiplomaById(offer.diplomaId()).getDiplomaName());
            education.put("speciality", diplomaTypeService.getDiplomaById(offer.diplomaId()).getSpeciality());
            offerData.put("education", education);

            if (offer.sections() != null) {
                for (Map.Entry<String, String> entry : offer.sections().entrySet()) {
                    offerData.put(entry.getKey(), entry.getValue());
                }
            }
        } catch (NumberFormatException e) {
            System.out.println("L'ID d'offre est invalide : " + offerId);
        } catch (Exception e) {
            System.out.println("Erreur lors de la récupération de l'offre : " + offerId);
        }
        return offerData;
    }


    /*
    @RabbitListener(queues = "${rabbitmq.cv-parsing.response-queue}")
    public void handleCvParsingResponse(CvProcessingResultDTO message) {
        System.out.println("✅ CV Parsing reçu : " + message);
        // À implémenter dans la prochaine étape
    }

     */


    @RabbitListener(queues = "${rabbitmq.cv-parsing.response-queue}")
    public void handleCvParsingResponse(CvProcessingResultDTO message) {


        // Vérifier que message n’est pas null
        if (message == null || message.applicationId() == null) {
            System.out.println("Received null message or applicationId");
            return;
        }



        // Récupérer l’entité Application
        System.out.println(message.applicationId());
        long totalApplications = applicationRepository.count();
        System.out.println("Nombre total de candidatures : " + totalApplications);
        Application application = applicationService.getApplicationById(message.applicationId().longValue());
        if (application == null) {
            System.out.println("Application not found for ID: {}");
            return;
        }

        // Cas 1 : parsing_result est vide
        CvProcessingResultDTO.ParsingResultDTO parsingResult = message.parsingResult();
        if (parsingResult == null || parsingResult.equals(new CvProcessingResultDTO.ParsingResultDTO("", "", "", null, null, null, null, null, null, null, null, null, null ))) {
            System.out.println("Empty parsing result for applicationId: {}, deleting application");
            try {
                applicationService.deleteApplication(message.applicationId());
                System.out.println("Application deleted successfully for applicationId: {}");
            } catch (Exception e) {
                System.out.println("Failed to delete application for ID: {}: {}");
            }
            return;
        }

        // Cas 2 : parsing_result non vide
        // Mettre à jour l’Application (données de notification)
        application.setName(parsingResult.name());
        // Avant modification
        // application.setEmail(parsingResult.email());
        // application.setMobilePhone(parsingResult.phone());
        // aprés modification
        // ----- Gestion Email -----
        if (parsingResult.email() == null) {
            application.setEmail(null);
        } else if (parsingResult.email().trim().isEmpty()) {
            application.setEmail(""); // conserver vide
        } else {
            List<String> emails = Arrays.stream(parsingResult.email().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();

            application.setEmail(!emails.isEmpty() ? emails.get(0) : parsingResult.email());
        }

// ----- Gestion Téléphone -----
        if (parsingResult.phone() == null) {
            application.setMobilePhone(null);
        } else if (parsingResult.phone().trim().isEmpty()) {
            application.setMobilePhone(""); // conserver vide
        } else {
            List<String> phones = Arrays.stream(parsingResult.phone().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();

            application.setMobilePhone(!phones.isEmpty() ? phones.get(0) : parsingResult.phone());
        }

        application.setApplicationStatus("Pending");

        // Créer l’entité Resume
        Resume resume = new Resume();
        resume.setName(parsingResult.name());
        resume.setEmail(parsingResult.email());
        resume.setPhone(parsingResult.phone());
        resume.setLinkedin(parsingResult.linkedin());
        resume.setAddress(parsingResult.address());
        //resume.setYearsOfExperience(parsingResult.yearsOfExperience());
        resume.setSkills(new ArrayList<>());
        resume.setLanguages(new ArrayList<>());
        resume.setEducations(new ArrayList<>());
        resume.setExperiences(new ArrayList<>());
        resume.setCertifications(new ArrayList<>());
        resume.setLinks(new ArrayList<>());

        // Ajouter les compétences (List<String> → List<Skill>)
        if (parsingResult.skills() != null) {
            for (String skillName : parsingResult.skills()) {
                if (skillName != null && !skillName.trim().isEmpty()) {
                    Skill skill = new Skill();
                    skill.setResume(resume);
                    skill.setName(skillName);
                    resume.getSkills().add(skill);
                }
            }
        }

        // Ajouter les langues
        if (parsingResult.languages() != null) {
            for (CvProcessingResultDTO.LanguageDTO lang : parsingResult.languages()) {
                if (lang.language() != null && !lang.language().trim().isEmpty()) {
                    Language language = new Language();
                    language.setResume(resume);
                    language.setName(lang.language());
                    language.setLevel(lang.level());
                    resume.getLanguages().add(language);
                }
            }
        }

        // Ajouter les éducations
        if (parsingResult.education() != null) {
            for (CvProcessingResultDTO.EducationDTO edu : parsingResult.education()) {
                if (edu.degree() != null && !edu.degree().trim().isEmpty() && edu.institution() != null && !edu.institution().trim().isEmpty()) {
                    Education education = new Education();
                    education.setResume(resume);
                    education.setDegree(edu.degree());
                    education.setInstitution(edu.institution());
                    education.setStartDateText(edu.startDate());
                    education.setEndDateText(edu.endDate());
                    resume.getEducations().add(education);
                }
            }
        }

        // Ajouter les expériences
        if (parsingResult.experience() != null) {
            for (CvProcessingResultDTO.ExperienceDTO exp : parsingResult.experience()) {
                if (exp.title() != null && !exp.title().trim().isEmpty()) {
                    Experience experience = new Experience();
                    experience.setResume(resume);
                    experience.setTitle(exp.title());
                    experience.setCompany(exp.company());
                    experience.setStartDateText(exp.startDate());
                    experience.setEndDateText(exp.endDate());
                    experience.setDescription(exp.description());
                    experience.setType(exp.type());
                    resume.getExperiences().add(experience);
                }
            }
        }

        // Ajouter les certifications
        if (parsingResult.certifications() != null) {
            for (CvProcessingResultDTO.CertificationDTO cert : parsingResult.certifications()) {
                if (cert.certification() != null && !cert.certification().trim().isEmpty()) {
                    Certification certification = new Certification();
                    certification.setResume(resume);
                    certification.setName(cert.certification());
                    certification.setDateText(cert.obtentionDate());
                    resume.getCertifications().add(certification);
                }
            }
        }

        // Ajouter les liens
        if (parsingResult.other() != null) {
            for (CvProcessingResultDTO.OtherLinkDTO link : parsingResult.other()) {
                if (link.link() != null && !link.link().trim().isEmpty()) {
                    Link linkEntity = new Link();
                    linkEntity.setResume(resume);
                    //linkEntity.(link.type());
                    linkEntity.setLink(link.link());
                    resume.getLinks().add(linkEntity);
                }
            }
        }

        // Sauvegarder le Resume
        try {
            resumeRepository.save(resume);
            application.setResume(resume);
            System.out.println("Resume saved successfully for applicationId: {}");
        } catch (Exception e) {
            System.out.println("Failed to save resume for applicationId: {}: {}");
            return;
        }

        // Cas 3 : matching_result présent
        CvProcessingResultDTO.MatchingResultDTO matchingResult = message.matchingResult();
        if (matchingResult != null && application.getJobOffer() != null) {
            Matches match = new Matches();
            match.setResume(resume);
            match.setJobOffer(application.getJobOffer());
            match.setSkillsScore((float) matchingResult.skillsScore());
            match.setExperienceScore( (float) matchingResult.experienceScore());
            match.setEducationScore( (float) matchingResult.educationScore());
            match.setLanguageScore( (float) matchingResult.languageScore());
            match.setCertificationScore( (float) matchingResult.certificationScore());
            match.setFinalScore( (float) matchingResult.finalScore());
            match.setJustification(matchingResult.justification());

            try {
                matchesRepository.save(match);
                application.setMatch(match);
                System.out.println("Matches saved successfully for applicationId: {}");
            } catch (Exception e) {
                System.out.println("Failed to save matches for applicationId: {}: {}");
                return;
            }
        }

        // Sauvegarder l’Application mise à jour
        try {
            applicationService.updateApplication(application);
            System.out.println("Application updated successfully for applicationId: {}");
        } catch (Exception e) {
            System.out.println("Failed to update application for ID: {}: {}");
        }
    }








}