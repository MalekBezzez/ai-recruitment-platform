package com.example.employeemodule.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "structured_training_session")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StructuredTrainingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "training_title")
    private String trainingTitle;

    @Column(name = "training_justification", columnDefinition = "TEXT")
    private String trainingJustification;

    @Column(name = "priority")
    private String priority;

    @Column(name = "priority_justification", columnDefinition = "TEXT")
    private String priorityJustification;

    @ManyToOne
    @JoinColumn(name = "training_recommendation_plan_id")
    private TrainingRecommendationPlan trainingRecommendationPlan;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "structured_training_session_employee",
            joinColumns = @JoinColumn(name = "structured_training_session_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private List<Employe> participants = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "included_skill_structured_training",
            joinColumns = @JoinColumn(name = "structured_training_session_id")
    )
    @Column(name = "included_skill_name")
    private List<String> includedSkills = new ArrayList<>();

    @Column(name = "skills_justification", columnDefinition = "TEXT")
    private String skillsJustification;

}
