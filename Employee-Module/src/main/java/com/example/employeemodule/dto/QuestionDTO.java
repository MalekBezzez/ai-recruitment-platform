package com.example.employeemodule.dto;

import com.example.employeemodule.entity.Question;

import java.util.List;
import java.util.Map;

public class QuestionDTO {

    private Long questionId;
    private String questionText;
    private String theme;
    private Question.QuestionType questionType;

    private List<String> choices;      // Pour CHOICE ou LIKERT
    Map<String, Integer> likertLabels;
 // Pour LIKERT
    private Integer scaleMax;          // Pour CHOICE / LIKERT

    private Double weight;             // Pour pondération

    // Getters & Setters
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

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public Question.QuestionType getQuestionType() {
        return questionType;
    }

    public void setQuestionType(Question.QuestionType questionType) {
        this.questionType = questionType;
    }

    public List<String> getChoices() {
        return choices;
    }

    public void setChoices(List<String> choices) {
        this.choices = choices;
    }

    public Map<String, Integer> getLikertLabels() {
        return likertLabels;
    }

    public void setLikertLabels(Map<String, Integer> likertLabels) {
        this.likertLabels = likertLabels;
    }

    public Integer getScaleMax() {
        return scaleMax;
    }

    public void setScaleMax(Integer scaleMax) {
        this.scaleMax = scaleMax;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }
}
