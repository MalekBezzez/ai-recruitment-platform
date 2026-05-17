package com.example.back.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "certification")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certification_id") // Correspond à la PK en DB
    private Long id;

    @Column(name = "certification_name", nullable = false, length = 100)
    private String name;


    // Stocke la date telle qu’écrite dans le CV (ex: "été 2023", "2021", etc.)
    @Column(name = "date", nullable = true)
    private String dateText;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false) // FK vers Resume
    @JsonIgnore // pour eviter le boucle inifinis
    private Resume resume;

}

