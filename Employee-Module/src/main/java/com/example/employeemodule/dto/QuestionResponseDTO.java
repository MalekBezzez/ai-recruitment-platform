package com.example.employeemodule.dto;

import com.example.employeemodule.entity.Question;

import java.util.List;
import java.util.Map;

// dto/QuestionResponseDTO.java
public class QuestionResponseDTO {
    private Long questionId;
    private String questionText;
    private Long employeeId;
    private String responseText;
    private  Question.QuestionType questionType; // Nouveau champ
    private Double weight; // Nouveau champ
    private Integer scaleMax; // Nouveau champ
    Map<String, Integer> likertLabels;
 // Nouveau champ

    // Constructeur
    public QuestionResponseDTO(Long questionId, String questionText, Long employeeId, String responseText,
                               Question.QuestionType questionType, Double weight, Integer scaleMax, Map<String, Integer> likertLabels) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.employeeId = employeeId;
        this.responseText = responseText;
        this.questionType = questionType;
        this.weight = weight;
        this.scaleMax = scaleMax;
        this.likertLabels = likertLabels;
    }

    // Getters et Setters
    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getResponseText() { return responseText; }
    public void setResponseText(String responseText) { this.responseText = responseText; }
    public  Question.QuestionType getQuestionType() { return questionType; }
    public void setQuestionType( Question.QuestionType questionType) { this.questionType = questionType; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public Integer getScaleMax() { return scaleMax; }
    public void setScaleMax(Integer scaleMax) { this.scaleMax = scaleMax; }

    public Map<String, Integer> getLikertLabels() {
        return likertLabels;
    }

    public void setLikertLabels(Map<String, Integer> likertLabels) {
        this.likertLabels = likertLabels;
    }
}