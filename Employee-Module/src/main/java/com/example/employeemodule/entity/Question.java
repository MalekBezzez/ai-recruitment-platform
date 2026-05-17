package com.example.employeemodule.entity;

import jakarta.persistence.*;

import java.util.List;
import java.util.Map;

@Entity
public class Question {

    public enum QuestionType {

        CHOICE,
        TEXT,
        LIKERT,
        BOOLEAN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;
    private Double weight;


    private String questionText;
   // private String responseId ;
    private String theme;
    @Enumerated(EnumType.STRING)
    private QuestionType questionType;
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Choice> choices;
    @ManyToOne
    @JoinColumn(name = "questionnaire_id")
    private Questionnaire questionnaire;
    private Integer scaleMax;

    @ElementCollection
    Map<String, Integer> likertLabels;


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

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers;
    public Questionnaire getQuestionnaire() {
        return questionnaire;
    }



    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
    }

    public Double getWeight() {
        return weight;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public QuestionType getQuestionType() {
        return questionType;
    }

    public void setQuestionType(QuestionType questionType) {
        this.questionType = questionType;
    }

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
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
}

