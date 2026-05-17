package com.example.employeemodule.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "career_pathing_skill")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerPathingSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String relatedSkillName;

    @Column
    private Boolean isExistingSkill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false) // FK vers CareerPathingJob
    private CareerPathingJob job;
}
