package com.example.employeemodule.dto;

public class SimpleItemDTO {
    // Si votre entity a Long, mettez Long. Si String, mettez String.
    private String employeeId;
    private String employeeName;
    private String sentiment;
    private String topic;     // utilisez le "generalTopic" si dispo
    private String emotion;   // utilisez le "generalEmotion" si dispo

    public SimpleItemDTO() {}

    public SimpleItemDTO(String employeeId, String employeeName, String sentiment, String topic, String emotion) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.sentiment = sentiment;
        this.topic = topic;
        this.emotion = emotion;
    }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getSentiment() { return sentiment; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getEmotion() { return emotion; }
    public void setEmotion(String emotion) { this.emotion = emotion; }
}
