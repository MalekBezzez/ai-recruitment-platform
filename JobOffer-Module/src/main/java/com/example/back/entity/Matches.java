package com.example.back.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Matches {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    private Long id;

    @Column(name = "skills_score", nullable = false)
    private Float skillsScore;

    @Column(name = "experience_score", nullable = false)
    private Float experienceScore;

    @Column(name = "education_score", nullable = false)
    private Float educationScore;

    @Column(name = "language_score", nullable = false)
    private Float languageScore;

    @Column(name = "certification_score", nullable = false)
    private Float certificationScore;

    @Column(name = "final_score", nullable = false)
    private Float finalScore;

    @Column(name = "justification", columnDefinition = "TEXT")
    private String justification;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @ManyToOne
    @JoinColumn(name = "job_offer_id", nullable = false)
    private Offer jobOffer;

}

