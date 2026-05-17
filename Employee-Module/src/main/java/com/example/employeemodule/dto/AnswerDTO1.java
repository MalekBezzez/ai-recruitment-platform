package com.example.employeemodule.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;
public class AnswerDTO1 {

    @JsonProperty("questionId")
    private Long questionId;

    @JsonProperty("questionText")
    private String questionText;

    @JsonProperty("questionType")
    private String questionType;

    @JsonProperty("weight")
    private Double weight;

    @JsonProperty("answer")
    private String answer;

    @JsonProperty("employeeId")
    private Long employeeId;

    @JsonProperty("scale_max")
    private Integer scaleMax;



    @JsonProperty("likert_labels")
    private Map<String, Integer> likertLabels;

    @JsonProperty("questionnaireId") // New field
    private Long questionnaireId;

    public Long getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(Long questionnaireId) {
        this.questionnaireId = questionnaireId;
    }
// Getters and Setters

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Integer getScaleMax() {
        return scaleMax;
    }

    public void setScaleMax(Integer scaleMax) {
        this.scaleMax = scaleMax;
    }

    public Map<String, Integer> getLikertLabels() {
        return likertLabels;
    }

    public void setLikertLabels(Map<String, Integer> likertLabels) {
        this.likertLabels = likertLabels;
    }
}
