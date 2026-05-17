package com.example.back.controller;


import com.example.back.dto.*;
import com.example.back.entity.Application;
import com.example.back.Service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;


    @PostMapping
    public ResponseEntity<Application> createApplication(@RequestBody Application application) {
        return ResponseEntity.ok(applicationService.saveApplication(application));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplication(@PathVariable Long id) {
        Application application = applicationService.getApplicationById(id);
        return application != null ? ResponseEntity.ok(application) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @PutMapping
    public ResponseEntity<Application> updateApplication(@RequestBody Application application) {
        return ResponseEntity.ok(applicationService.updateApplication(application));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {

        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

    //Get applications by JOBOFFER_Id
    @GetMapping("/by-job-offer/{jobOfferId}")
    public ResponseEntity<List<Application>> getApplicationsByJobOfferId(@PathVariable Long jobOfferId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJobOfferId(jobOfferId));
    }


    @GetMapping("/joboffer/{offerId}")
    public ResponseEntity<List<ApplicationResponseDTO>> getApplicationsByJobOffer(@PathVariable Long offerId) {
        List<ApplicationResponseDTO> applications = applicationService.getApplicationsByJobOffer(offerId);
        return ResponseEntity.ok(applications);
    }


    @GetMapping("/score-details/{applicationId}")
    public ResponseEntity<ScoreDetailsDTO> getScoreDetails(@PathVariable Long applicationId) {
        ScoreDetailsDTO scoreDetails = applicationService.getScoreDetails(applicationId);
        return ResponseEntity.ok(scoreDetails);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {

        String newStatus = payload.get("status");

        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        applicationService.updateApplicationStatus(id, newStatus);
        return ResponseEntity.noContent().build(); // 204 No Content
    }


    @GetMapping("/planning-info/{applicationId}")
    public ResponseEntity<InterviewPlanningInfoDTO> getPlanningInfo(@PathVariable Long applicationId) {
        InterviewPlanningInfoDTO dto = applicationService.getInterviewPlanningInfo(applicationId);
        return ResponseEntity.ok(dto);
    }




    // ✅ Endpoint : toutes les candidatures (avec titre de l'offre)
    @GetMapping("/all")
    public ResponseEntity<List<AllApplicationsResponseDTO>> getAllApplicationsDTO() {
        List<AllApplicationsResponseDTO> applications = applicationService.getAllApplicationsDTO();
        return ResponseEntity.ok(applications);
    }


    @PostMapping("/filter")
    public ResponseEntity<List<AllApplicationsResponseDTO>> filterAllApplications(
            @RequestBody FilterApplicationDTO filterDTO) {

        List<AllApplicationsResponseDTO> results = applicationService.getFilteredApplications(filterDTO);
        return ResponseEntity.ok(results);
    }


    @PostMapping("/filter-by-offer")
    public ResponseEntity<List<ApplicationResponseDTO>> filterApplicationsByOffer(
            @RequestBody FilterApplicationDTO filterDTO) {

        List<ApplicationResponseDTO> applications = applicationService.getFilteredApplicationsForJobOffer(filterDTO);
        return ResponseEntity.ok(applications);
    }


    @GetMapping("/{id}/cv")
    public ResponseEntity<byte[]> getCvFile(@PathVariable Long id) {
        byte[] cvContent = applicationService.getCvFileByApplicationId(id);
        if (cvContent == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF) // ou détecter dynamiquement
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"cv_" + id + ".pdf\"")
                .body(cvContent);
    }








}
