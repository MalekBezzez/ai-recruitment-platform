package com.example.employeemodule.dto;

import com.example.employeemodule.entity.PredictionItem;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public class PredictionItemDTO {

    private String employeeId;
    private String idTest;
    private String employeeName;
    private String message;
    private String sentiment;
    private String emotion;
    private String topic;
    private LocalDateTime analyzedAt;

    private String generalEmotion;
    private String generalTopic;

    @JsonProperty("general_emotion")
    public String getGeneralEmotion() {
        return generalEmotion;
    }

    @JsonProperty("general_emotion")
    public void setGeneralEmotion(String generalEmotion) {
        this.generalEmotion = generalEmotion;
    }

    @JsonProperty("general_topic")
    public String getGeneralTopic() {
        return generalTopic;
    }

    @JsonProperty("general_topic")
    public void setGeneralTopic(String generalTopic) {
        this.generalTopic = generalTopic;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public String getIdTest() {
        return idTest;
    }

    public void setIdTest(String idTest) {
        this.idTest = idTest;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSentiment() {
        return sentiment;
    }

    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }

    public String getEmotion() {
        return emotion;
    }

    public void setEmotion(String emotion) {
        this.emotion = emotion;
    }



    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }


    public LocalDateTime getAnalyzedAt() {
        return analyzedAt;
    }

    public void setAnalyzedAt(LocalDateTime analyzedAt) {
        this.analyzedAt = analyzedAt;
    }
    public static PredictionItemDTO fromEntity(PredictionItem entity) {
        PredictionItemDTO dto = new PredictionItemDTO();
        dto.setMessage(entity.getMessage());
        dto.setEmployeeId(entity.getEmployeeId());
        dto.setEmployeeName(entity.getEmployeeName());
        dto.setSentiment(entity.getSentiment());
        dto.setEmotion(entity.getEmotion());
        dto.setGeneralEmotion(entity.getGeneralEmotion()); // si disponible
        dto.setTopic(entity.getTopic());
        dto.setGeneralTopic(entity.getGeneralTopic());     // si disponible
        dto.setAnalyzedAt(entity.getAnalyzedAt());         // si disponible
        dto.setIdTest(String.valueOf(entity.getIdTest())); // conversion en String
        return dto;
    }

}
