package com.example.employeemodule.dto;

import java.util.List;

public class QuestionnaireWithAnswersDTO {
    private Long questionnaireId;
    private String title;
    private List<EmployeAnswerSummary> responses;
    public static class EmployeAnswerSummary {
        private Long employeId;
        private String employeName;
        private int answerCount;

        public Long getEmployeId() {
            return employeId;
        }

        public void setEmployeId(Long employeId) {
            this.employeId = employeId;
        }

        public String getEmployeName() {
            return employeName;
        }

        public void setEmployeName(String employeName) {
            this.employeName = employeName;
        }

        public int getAnswerCount() {
            return answerCount;
        }

        public void setAnswerCount(int answerCount) {
            this.answerCount = answerCount;
        }

        // getters and setters
    }
    public Long getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(Long questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<EmployeAnswerSummary> getResponses() {
        return responses;
    }

    public void setResponses(List<EmployeAnswerSummary> responses) {
        this.responses = responses;
    }
}