package com.example.employeemodule.dto;



import com.example.employeemodule.entity.Question;

import java.util.List;
import java.util.Map;

public class DetailedAnswerDTO {
    private Long employeeId;
    private Long questionId;
    private Question.QuestionType questionType;
    private String questionText;
    private Double weight;
    private String answer;
    private Integer scaleMax;
    Map<String, Integer> likertLabels;

    public Map<String, Integer> getLikertLabels() {
        return likertLabels;
    }

    public void setLikertLabels(Map<String, Integer> likertLabels) {
        this.likertLabels = likertLabels;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Question.QuestionType getQuestionType() {
        return questionType;
    }

    public void setQuestionType(Question.QuestionType questionType) {
        this.questionType = questionType;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
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

    public Integer getScaleMax() {
        return scaleMax;
    }

    public void setScaleMax(Integer scaleMax) {
        this.scaleMax = scaleMax;
    }



    // Getters et Setters
}
