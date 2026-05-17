package com.example.back.controller;


import com.example.back.Service.InterviewService;
import com.example.back.Service.OfferService;
import com.example.back.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor


public class InterviewController {
    private final InterviewService interviewService;

    @PostMapping("/schedule")
    public ResponseEntity<Void> scheduleInterview(@RequestBody ScheduleInterviewRequestDTO dto) {
        interviewService.scheduleInterview(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build(); // HTTP 201 sans body
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponseDTO> getInterviewById(@PathVariable Long id) {
        InterviewResponseDTO dto = interviewService.getInterviewDtoById(id);
        return ResponseEntity.ok(dto);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Void> updateInterview(
            @PathVariable Long id,
            @RequestBody ScheduleInterviewRequestDTO dto) {

        interviewService.updateInterview(id, dto);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @GetMapping
    public ResponseEntity<List<InterviewDTO>> getAllInterviews() {
        List<InterviewDTO> interviews = interviewService.getAllInterviewsDTO();
        return ResponseEntity.ok(interviews);
    }


    @GetMapping("/by-application/{applicationId}")
    public ResponseEntity<List<InterviewDTO>> getInterviewsByApplicationId(@PathVariable Long applicationId) {
        List<InterviewDTO> interviewDTOs = interviewService.getInterviewsDTOByApplicationId(applicationId);
        return ResponseEntity.ok(interviewDTOs);
    }

    @GetMapping("/details")
    public ResponseEntity<List<InterviewDetailsDTO>> getAllInterviewDetails() {
        List<InterviewDetailsDTO> interviewDetails = interviewService.getAllInterviewDetails();
        return ResponseEntity.ok(interviewDetails);
    }



    @PostMapping("/filter")
    public ResponseEntity<List<InterviewDetailsDTO>> filterInterviews(@RequestBody InterviewFilterDTO filter) {
        List<InterviewDetailsDTO> filteredInterviews = interviewService.filterInterviews(filter);
        return ResponseEntity.ok(filteredInterviews);
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateInterviewStatus(
            @PathVariable Long id,
            @RequestBody UpdateInterviewStatusRequestDTO dto) {

        interviewService.updateInterviewStatus(id, dto);
        return ResponseEntity.noContent().build(); // 204 No Content
    }



    }
