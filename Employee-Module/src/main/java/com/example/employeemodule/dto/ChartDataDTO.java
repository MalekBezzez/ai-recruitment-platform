package com.example.employeemodule.dto;



import java.util.List;
import java.util.Map;

public class ChartDataDTO {
    private Long predictionResultId;
    private Map<String, Integer> sentimentCounts;
    private Map<String, Integer> emotionCounts;
    private Map<String, Integer> topicCounts;
    private List<SimpleItemDTO> items;

    public List<SimpleItemDTO> getItems() {
        return items;
    }

    public void setItems(List<SimpleItemDTO> items) {
        this.items = items;
    }

    public Long getPredictionResultId() {
        return predictionResultId;
    }

    public void setPredictionResultId(Long predictionResultId) {
        this.predictionResultId = predictionResultId;
    }

    public Map<String, Integer> getSentimentCounts() {
        return sentimentCounts;
    }

    public void setSentimentCounts(Map<String, Integer> sentimentCounts) {
        this.sentimentCounts = sentimentCounts;
    }

    public Map<String, Integer> getEmotionCounts() {
        return emotionCounts;
    }

    public void setEmotionCounts(Map<String, Integer> emotionCounts) {
        this.emotionCounts = emotionCounts;
    }

    public Map<String, Integer> getTopicCounts() {
        return topicCounts;
    }

    public void setTopicCounts(Map<String, Integer> topicCounts) {
        this.topicCounts = topicCounts;
    }
}
