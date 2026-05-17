package com.example.employeemodule.dto;

import java.util.Date;

public class EmployeeInsightDTO {
    private Long employeeInsightId;
    private Integer discussionId;
    private Date periodStart;
    private Date periodEnd;
    private String globalClassification;
    private Float intensityScore;
    private String dominantSentiment;
    private String extractedTopics;
    private String tone;
    private Float contactCount;
    private Float centrality;
    private Boolean isolationFlag;
    private Boolean riskFlag;
    private String riskType;
    private Integer noMessage;
    private Long userId;

    public Long getEmployeeInsightId() {
        return employeeInsightId;
    }

    public void setEmployeeInsightId(Long employeeInsightId) {
        this.employeeInsightId = employeeInsightId;
    }

    public Integer getDiscussionId() {
        return discussionId;
    }

    public void setDiscussionId(Integer discussionId) {
        this.discussionId = discussionId;
    }

    public Date getPeriodStart() {
        return periodStart;
    }

    public void setPeriodStart(Date periodStart) {
        this.periodStart = periodStart;
    }

    public Date getPeriodEnd() {
        return periodEnd;
    }

    public void setPeriodEnd(Date periodEnd) {
        this.periodEnd = periodEnd;
    }

    public String getGlobalClassification() {
        return globalClassification;
    }

    public void setGlobalClassification(String globalClassification) {
        this.globalClassification = globalClassification;
    }

    public Float getIntensityScore() {
        return intensityScore;
    }

    public void setIntensityScore(Float intensityScore) {
        this.intensityScore = intensityScore;
    }

    public String getDominantSentiment() {
        return dominantSentiment;
    }

    public void setDominantSentiment(String dominantSentiment) {
        this.dominantSentiment = dominantSentiment;
    }

    public String getExtractedTopics() {
        return extractedTopics;
    }

    public void setExtractedTopics(String extractedTopics) {
        this.extractedTopics = extractedTopics;
    }

    public String getTone() {
        return tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }

    public Float getContactCount() {
        return contactCount;
    }

    public void setContactCount(Float contactCount) {
        this.contactCount = contactCount;
    }

    public Float getCentrality() {
        return centrality;
    }

    public void setCentrality(Float centrality) {
        this.centrality = centrality;
    }

    public Boolean getIsolationFlag() {
        return isolationFlag;
    }

    public void setIsolationFlag(Boolean isolationFlag) {
        this.isolationFlag = isolationFlag;
    }

    public Boolean getRiskFlag() {
        return riskFlag;
    }

    public void setRiskFlag(Boolean riskFlag) {
        this.riskFlag = riskFlag;
    }

    public String getRiskType() {
        return riskType;
    }

    public void setRiskType(String riskType) {
        this.riskType = riskType;
    }

    public Integer getNoMessage() {
        return noMessage;
    }

    public void setNoMessage(Integer noMessage) {
        this.noMessage = noMessage;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
