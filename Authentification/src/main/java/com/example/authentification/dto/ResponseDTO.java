package com.example.authentification.dto;

import java.util.List;

public class ResponseDTO {
    private Long questionnaireId;
    private Long employeeId;
    private Long questionId;
    private String questionType;
    private String questionText;
    private Double weight;
    private String answer;
    private Integer scale_max;
    private List<String> likert_labels;

    public Long getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(Long questionnaireId) {
        this.questionnaireId = questionnaireId;
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

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
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

    public Integer getScale_max() {
        return scale_max;
    }

    public void setScale_max(Integer scale_max) {
        this.scale_max = scale_max;
    }

    public List<String> getLikert_labels() {
        return likert_labels;
    }

    public void setLikert_labels(List<String> likert_labels) {
        this.likert_labels = likert_labels;
    }


}