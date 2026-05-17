package com.example.employeemodule.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "career_pathing_recommendation_employee")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerPathingEmployee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Référence vers l'employé
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employe employee;



    // Lien vers la recommandation
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommendation_id")
    private CareerPathingRecommendationPlan recommendation;
}