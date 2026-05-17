package com.example.employeemodule.controller;

import com.example.employeemodule.Service.QuestionnaireService;
import com.example.employeemodule.dto.DetailedAnswerDTO;
import com.example.employeemodule.dto.EmployeAnswerSummaryDTO;
import com.example.employeemodule.dto.QuestionnaireDTO;
import com.example.employeemodule.dto.QuestionnaireWithAnswersDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/questionnaires")
public class QuestionnaireController {

    @Autowired
    private QuestionnaireService questionnaireService;



    @PostMapping
    public ResponseEntity<QuestionnaireDTO> create(@RequestBody QuestionnaireDTO dto) {
        QuestionnaireDTO created = questionnaireService.save(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionnaireDTO> getById(@PathVariable Long id) {
        QuestionnaireDTO dto = questionnaireService.getById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/with-answers")
    public ResponseEntity<List<QuestionnaireWithAnswersDTO>> getWithAnswers() {
        return ResponseEntity.ok(questionnaireService.getQuestionnairesWithAnswers());
    }

    @GetMapping("/{id}/answers")
    public ResponseEntity<List<EmployeAnswerSummaryDTO>> getAnswersByQuestionnaire(@PathVariable Long id) {
        return ResponseEntity.ok(questionnaireService.getAnswersByQuestionnaireId(id));
    }

    @GetMapping("/with-response-count")
    public ResponseEntity<List<Map<String, Object>>> getAllWithResponseCount() {
        List<Map<String, Object>> result = questionnaireService.getAllWithRespondentCount();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/answers/with-answers/{id}")
    public ResponseEntity<List<DetailedAnswerDTO>> getDetailedAnswers(@PathVariable Long id) {
        return ResponseEntity.ok(questionnaireService.getDetailedAnswers(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestionnaire(@PathVariable Long id) {
        questionnaireService.deleteQuestionnaire(id);
        return ResponseEntity.noContent().build();
    }



    @GetMapping
    public ResponseEntity<List<QuestionnaireDTO>> getAll() {
        return ResponseEntity.ok(questionnaireService.getAll());
    }
}