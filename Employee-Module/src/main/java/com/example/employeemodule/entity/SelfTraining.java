package com.example.employeemodule.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "self_training_employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SelfTraining {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "self_training_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private TrainingRecommendationPlan recommendationPlan;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employe employee;

    @OneToMany(mappedBy = "selfTraining", cascade = CascadeType.ALL)
    private List<SelfTrainingSession> sessions;
}
