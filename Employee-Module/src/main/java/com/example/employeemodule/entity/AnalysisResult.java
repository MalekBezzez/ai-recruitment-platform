package com.example.employeemodule.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "analysis_result", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"employee_id", "questionnaire_id"})
})
public class AnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "questionnaire_id", nullable = false)
    private Long questionnaireId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    private double globalSatisfaction;

    private double adjustedSatisfaction;

    private double dissatisfactionScore;

    @Column(length = 1000)
    private String satisfactionCauses;

    @Column(length = 1000)
    private String dissatisfactionCauses;

    private LocalDateTime analyzedAt;
    @Column(length = 1000)
    private String neutralCauses;


}

