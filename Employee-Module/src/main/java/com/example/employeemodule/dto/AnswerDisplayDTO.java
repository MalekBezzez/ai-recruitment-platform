package com.example.employeemodule.dto;

public class AnswerDisplayDTO {
    private String questionText;
    private String responseText;
    private String employeFullName;
    private String ResponseId;

    public String getResponseId() {
        return ResponseId;
    }

    public void setResponseId(String responseId) {
        ResponseId = responseId;
    }

    public AnswerDisplayDTO() {}

    public AnswerDisplayDTO(String questionText, String responseText, String employeFullName) {
        this.questionText = questionText;
        this.responseText = responseText;
        this.employeFullName = employeFullName;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getResponseText() {
        return responseText;
    }

    public void setResponseText(String responseText) {
        this.responseText = responseText;
    }

    public String getEmployeFullName() {
        return employeFullName;
    }

    public void setEmployeFullName(String employeFullName) {
        this.employeFullName = employeFullName;
    }
}
