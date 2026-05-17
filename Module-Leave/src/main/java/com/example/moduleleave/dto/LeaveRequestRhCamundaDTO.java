package com.example.moduleleave.dto;



import java.util.Date;

public class LeaveRequestRhCamundaDTO {
    private String taskId;
    private String processInstanceId;
    private Long leaveRequestId;
    private String typeConge;
    private String dateDebut;
    private String dateFin;
    private String commentaire;
    private Date validatedOn;    // c'est endTime de la tâche RH

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getProcessInstanceId() {
        return processInstanceId;
    }

    public void setProcessInstanceId(String processInstanceId) {
        this.processInstanceId = processInstanceId;
    }

    public Long getLeaveRequestId() {
        return leaveRequestId;
    }

    public void setLeaveRequestId(Long leaveRequestId) {
        this.leaveRequestId = leaveRequestId;
    }

    public String getTypeConge() {
        return typeConge;
    }

    public void setTypeConge(String typeConge) {
        this.typeConge = typeConge;
    }

    public String getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(String dateDebut) {
        this.dateDebut = dateDebut;
    }

    public String getDateFin() {
        return dateFin;
    }

    public void setDateFin(String dateFin) {
        this.dateFin = dateFin;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public Date getValidatedOn() {
        return validatedOn;
    }

    public void setValidatedOn(Date validatedOn) {
        this.validatedOn = validatedOn;
    }
}

