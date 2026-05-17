package com.example.employeemodule.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "career_pathing_recommendation_plan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerPathingRecommendationPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id") // clé étrangère
    private Employe requester;

    @Column(name = "created_at")
    private LocalDateTime createdAt;


    private String status;

}