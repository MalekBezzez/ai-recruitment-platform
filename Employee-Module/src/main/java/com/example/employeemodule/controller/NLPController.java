package com.example.employeemodule.controller;

import com.example.employeemodule.dto.*;
import com.example.employeemodule.entity.AnalysisResult;
import com.example.employeemodule.rabbit.RabbitProducer;
import com.example.employeemodule.Service.AnalysisResultService;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/nlp")
public class NLPController {

    @Autowired
    private RabbitProducer rabbitProducer;

    @Autowired
    private AnalysisResultService resultService;
    @Value("${jwt.secret}")
    private String secretKey;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeAndSave(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody surveyAiDTO request) {
        try {
            Long initiatorUserId = request.getInitiatorUserId();
            List<AnswerDTO1> answers = request.getResponses();

            if (answers == null || answers.isEmpty()) {
                return ResponseEntity.badRequest().body("La liste des réponses ne peut pas être vide.");
            }

            Long questionnaireId = answers.get(0).getQuestionnaireId();
            if (questionnaireId == null) {
                throw new IllegalArgumentException("questionnaireId est requis");
            }

            for (AnswerDTO1 dto : answers) {
                if (dto.getQuestionType().equalsIgnoreCase("text") &&
                        dto.getScaleMax() == null) {
                    dto.setScaleMax(3);
                }
                if (dto.getQuestionType().equalsIgnoreCase("date") &&
                        dto.getScaleMax() == null) {
                    dto.setScaleMax(5);
                }
                if (!"likert".equalsIgnoreCase(dto.getQuestionType())) {
                    dto.setLikertLabels(null);
                }
                dto.setQuestionnaireId(questionnaireId);
            }

            NlpAnalysisMessage message = new NlpAnalysisMessage();
            message.setQuestionnaireId(questionnaireId);
            message.setToken(authHeader.replace("Bearer ", "").trim()); // toujours transmettre le token
            message.setInitiatorUserId(initiatorUserId);
            message.setResponses(answers.stream().map(dto -> {
                ResponseDTO responseDTO = new ResponseDTO();
                responseDTO.setQuestionId(dto.getQuestionId());
                responseDTO.setQuestionText(dto.getQuestionText());
                responseDTO.setQuestionType(dto.getQuestionType());
                responseDTO.setWeight(dto.getWeight());
                responseDTO.setAnswer(dto.getAnswer());
                responseDTO.setEmployeeId(dto.getEmployeeId());
                responseDTO.setScale_max(dto.getScaleMax());
                responseDTO.setLikertLabels(dto.getLikertLabels());
                responseDTO.setQuestionnaireId(questionnaireId);
                return responseDTO;
            }).collect(Collectors.toList()));

            rabbitProducer.sendForAnalysis(message);
            System.out.println("📤 Message envoyé à RabbitMQ pour Q" + questionnaireId);

            return ResponseEntity.accepted().body("Analyse NLP en file d'attente pour le questionnaire " + questionnaireId);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'envoi pour analyse NLP : " + e.getMessage());
        }
    }

    @PostMapping("/save-results")
    public ResponseEntity<?> saveResults(@RequestBody AnalysisResultMessage resultMessage) {
        try {
            Long initiatorUserId = resultMessage.getInitiatorUserId();
            System.out.println("📢 initiatorUserId (pour SSE) : " + initiatorUserId);
            List<AnalysisResult> entities = resultMessage.getResults().stream()
                    .map(dto -> AnalysisResult.builder()
                            .employeeId(dto.getEmployeeId())
                            .questionnaireId(dto.getQuestionnaireId())
                            .globalSatisfaction(dto.getGlobalSatisfaction())
                            .adjustedSatisfaction(dto.getAdjustedSatisfaction())
                            .dissatisfactionScore(dto.getDissatisfactionScore())
                            .satisfactionCauses(dto.getSatisfactionCauses())
                            .dissatisfactionCauses(dto.getDissatisfactionCauses())
                            .build())
                    .collect(Collectors.toList());

            resultService.saveAll(entities);
            System.out.println("✅ Résultats enregistrés pour Q" + resultMessage.getQuestionnaireId());

            return ResponseEntity.ok("Résultats enregistrés avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'enregistrement des résultats : " + e.getMessage());
        }
    }
}