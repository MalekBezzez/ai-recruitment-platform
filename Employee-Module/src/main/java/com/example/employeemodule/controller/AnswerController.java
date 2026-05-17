package com.example.employeemodule.controller;

import com.example.employeemodule.Service.AnswerService;
import com.example.employeemodule.Service.QuestionService;
import com.example.employeemodule.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/answers")

public class AnswerController {

    @Autowired
    private AnswerService answerService;
    @Autowired
    private QuestionService questionService;

    @PostMapping
    public ResponseEntity<Void> submitAnswers(@RequestBody List<AnswerDTO> answerDTOs) {
        System.out.println("Réponse DTO : " + answerDTOs);

        answerService.saveAnswers(answerDTOs);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{questionnaireId}/employee/{employeId}")
    public ResponseEntity<List<AnswerDisplayDTO>> getAnswersByEmployeeAndQuestionnaire(
            @PathVariable Long questionnaireId,
            @PathVariable Long employeId) {

        return ResponseEntity.ok(
                answerService.getAnswersByQuestionnaireAndEmployee(questionnaireId, employeId)
        );
    }
    @GetMapping("/with-answers/{questionnaireId}")
    public ResponseEntity<List<QuestionResponseDTO>> getQuestionsWithAnswers(
            @PathVariable Long questionnaireId) {
        return ResponseEntity.ok(questionService.getQuestionsWithAnswersByQuestionnaire(questionnaireId));
    }

    @GetMapping("/questionnaire/{questionnaireId}/employees")
    public ResponseEntity<List<EmployeDTO>> getEmployeesWhoAnswered(@PathVariable Long questionnaireId) {
        return ResponseEntity.ok(answerService.getEmployeesWhoAnswered(questionnaireId));
    }
    @GetMapping("/exists")
    public ResponseEntity<Boolean> hasAlreadyAnswered(
            @RequestParam Long questionnaireId,
            @RequestParam Long employeId
    ) {
        boolean exists = answerService.hasAnswered(questionnaireId, employeId);
        return ResponseEntity.ok(exists);
    }
    @GetMapping("/questionnaire/{questionnaireId}/count")
    public ResponseEntity<Integer> countEmployeesWhoAnswered(@PathVariable Long questionnaireId) {
        int count = answerService.countEmployeesWhoAnswered(questionnaireId);
        return ResponseEntity.ok(count);
    }

}

