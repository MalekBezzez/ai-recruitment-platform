package com.example.back.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "Experience")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Experience_Id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = true)
    private String company;

    @Column(name = "Start_Date")
    private String startDateText;

    @Column(name = "End_Date")
    private String endDateText; // Peut être null si expérience en cours

    @Column(columnDefinition = "TEXT")
    private String description;

    private String type; // Ex: "Full-time", "Part-time", "Stage", etc.

    @ManyToOne
    @JoinColumn(name = "Resume_Id", nullable = false)
    @JsonIgnore
    private Resume resume;
}
