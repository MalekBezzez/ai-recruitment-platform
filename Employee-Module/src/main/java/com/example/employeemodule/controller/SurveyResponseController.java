package com.example.employeemodule.controller;

import com.example.employeemodule.Service.SurveyResponseService;
import com.example.employeemodule.dto.SurveyResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/survey-responses")
public class SurveyResponseController {

    @Autowired
    private SurveyResponseService service;

    @PostMapping
    public ResponseEntity<SurveyResponseDTO> create(@RequestBody SurveyResponseDTO dto) {
        return ResponseEntity.ok(service.save(dto));
    }

    @GetMapping
    public ResponseEntity<List<SurveyResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
