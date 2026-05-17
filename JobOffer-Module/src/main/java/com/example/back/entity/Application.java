package com.example.back.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "Application")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_Id")
    private Long id;

    @Column
    private String email;

    @Column
    private String name;


    @Column(name = "Mobile_Phone")
    private String mobilePhone;

    @Lob
    @Column(name = "CV_File")
    private byte[] cvFile;

    @Column(name = "Application_Date")
    @Temporal(TemporalType.DATE)
    private Date applicationDate;

    @Column(name = "Application_Status")
    private String applicationStatus;

    // optionnelle pour les candidatures spontanées
    @ManyToOne
    @JoinColumn(name = "Job_Offer_Id") // Par défaut nullable = true
    private Offer jobOffer;

    // obligatoire vers le resume
    @ManyToOne(optional = true)
    @JoinColumn(name = "Resume_Id", nullable = true)
    private Resume resume;


    // optionnelle vers le match
    @OneToOne
    @JoinColumn(name = "Match_Id", nullable = true)
    private Matches match;

    // what i added 6/22

    // Ajouté pour les candidatures spontanées uniquement
    @Column(name = "Spontaneous_Job_Title")
    private String spontaneousJobTitle;


}