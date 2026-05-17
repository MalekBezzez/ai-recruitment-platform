package com.example.employeemodule.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "training_recommendation_plan")
public class TrainingRecommendationPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private Long id;

    // Relation ManyToOne vers Employe pour le requester
    @ManyToOne // fetch LAZY est recommandé pour les relations ManyToOne
    @JoinColumn(name = "requester_id") //
    private Employe requester;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "status")
    private String status;
}
