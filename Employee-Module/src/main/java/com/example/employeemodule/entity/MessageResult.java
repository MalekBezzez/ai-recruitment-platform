package com.example.employeemodule.entity;


import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "message_results")
public class MessageResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;

    @ElementCollection
    @CollectionTable(name = "message_result_messages", joinColumns = @JoinColumn(name = "message_result_id"))
    @Column(name = "message")
    private List<String> messages;

    private Double predictionScore; // un exemple de champ prédictif, à adapter

    // Getters et setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public List<String> getMessages() {
        return messages;
    }

    public void setMessages(List<String> messages) {
        this.messages = messages;
    }

    public Double getPredictionScore() {
        return predictionScore;
    }

    public void setPredictionScore(Double predictionScore) {
        this.predictionScore = predictionScore;
    }
}
