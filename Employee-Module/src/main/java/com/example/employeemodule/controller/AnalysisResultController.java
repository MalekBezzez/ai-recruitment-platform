package com.example.employeemodule.controller;

import com.example.employeemodule.dto.AnalysisResultDTO;
import com.example.employeemodule.entity.AnalysisResult;
import com.example.employeemodule.Service.AnalysisResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/results")
public class AnalysisResultController {

    @Autowired
    private AnalysisResultService resultService;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/analyze/{questionnaireId}")
    public ResponseEntity<Void> analyzeQuestionnaire(@PathVariable Long questionnaireId, @RequestHeader("Authorization") String token) {
        try {
            // 1. Fetch responses from Spring backend
            String answersUrl = "http://localhost:8085/answers/with-answers/" + questionnaireId;
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<List> response = restTemplate.exchange(answersUrl, HttpMethod.GET, entity, List.class);
            List<?> responses = response.getBody();

            // 2. Forward to FastAPI for analysis
            String fastApiUrl = "http://localhost:8000/analyze";
            HttpEntity<List<?>> fastApiEntity = new HttpEntity<>(responses, headers);
            ResponseEntity<List> fastApiResponse = restTemplate.exchange(fastApiUrl, HttpMethod.POST, fastApiEntity, List.class);
            List<?> analysisResults = fastApiResponse.getBody();

            // 3. Add questionnaireId to results and save
            List<AnalysisResultDTO> dtos = analysisResults.stream().map(result -> {
                AnalysisResultDTO dto = new AnalysisResultDTO();
                // Assuming result is a Map or similar, map fields accordingly
                dto.setQuestionnaireId(questionnaireId);
                dto.setEmployeeId(((Number) ((java.util.Map) result).get("employeeId")).longValue());
                dto.setGlobalSatisfaction(((Number) ((java.util.Map) result).get("global_satisfaction_%")).doubleValue());
                dto.setAdjustedSatisfaction(((Number) ((java.util.Map) result).get("adjusted_satisfaction_%")).doubleValue());
                dto.setDissatisfactionScore(((Number) ((java.util.Map) result).get("dissatisfaction_score_%")).doubleValue());
                dto.setSatisfactionCauses((String) ((java.util.Map) result).get("satisfaction_causes"));
                dto.setDissatisfactionCauses((String) ((java.util.Map) result).get("dissatisfaction_causes"));
                return dto;
            }).collect(Collectors.toList());

            List<AnalysisResult> results = dtos.stream().map(dto -> AnalysisResult.builder()
                    .questionnaireId(dto.getQuestionnaireId())
                    .employeeId(dto.getEmployeeId())
                    .globalSatisfaction(dto.getGlobalSatisfaction())
                    .adjustedSatisfaction(dto.getAdjustedSatisfaction())
                    .dissatisfactionScore(dto.getDissatisfactionScore())
                    .satisfactionCauses(dto.getSatisfactionCauses())
                    .dissatisfactionCauses(dto.getDissatisfactionCauses())
                    .build()).collect(Collectors.toList());

            resultService.saveAll(results);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/questionnaire/{questionnaireId}")
    public ResponseEntity<List<AnalysisResultDTO>> getResultsByQuestionnaireId(@PathVariable Long questionnaireId) {
        List<AnalysisResultDTO> results = resultService.getDTOByQuestionnaireId(questionnaireId);
        return ResponseEntity.ok(results);
    }
}