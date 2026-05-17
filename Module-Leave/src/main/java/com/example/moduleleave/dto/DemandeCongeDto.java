package com.example.moduleleave.dto;



import java.util.Date;

public record DemandeCongeDto(
        Long employeId,
        String typeConge,
        String managerId ,
        String dateDebut,
        String dateFin,
        String commentaire,
        String emailDestinataire
) {
    public Long getEmployeId() {
        return employeId;
    }
    public String getManagerId() {return managerId ;}

    public String getTypeConge() {
        return typeConge;
    }

    public String getDateDebut() {
        return dateDebut;
    }

    public String getDateFin() {
        return dateFin;
    }

    public String getCommentaire() {
        return commentaire;
    }
    public String getEmailDestinataire() {
        return emailDestinataire;
    }


    @Override
    public Long employeId() {
        return employeId;
    }

    @Override
    public String typeConge() {
        return typeConge;
    }

    @Override
    public String dateDebut() {
        return dateDebut;
    }

    @Override
    public String dateFin() {
        return dateFin;
    }

    @Override
    public String commentaire() {
        return commentaire;
    }
}