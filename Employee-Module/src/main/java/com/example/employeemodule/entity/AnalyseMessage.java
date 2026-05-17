package com.example.employeemodule.entity;

import jakarta.persistence.*;

@Entity
public class AnalyseMessage
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private String sentiment;
    private String emotion;
    private String topic;

    // Relation vers un MessageResult si tu veux stocker les prédictions groupées
    @ManyToOne
    @JoinColumn(name = "message_result_id")
    private MessageResult messageResult;

    // getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSentiment() { return sentiment; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }

    public String getEmotion() { return emotion; }
    public void setEmotion(String emotion) { this.emotion = emotion; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public MessageResult getMessageResult() { return messageResult; }
    public void setMessageResult(MessageResult messageResult) { this.messageResult = messageResult; }
}

