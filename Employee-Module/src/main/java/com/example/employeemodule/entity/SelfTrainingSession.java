package com.example.employeemodule.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "self_training_session")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SelfTrainingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "self_training_session_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "self_training_id")
    private SelfTraining selfTraining;

    @Column(name = "training_title")
    private String trainingTitle;

    @Column(name = "skills_justification", columnDefinition = "TEXT")
    private String skillsJustification;

    @Column(name = "training_justification", columnDefinition = "TEXT")
    private String trainingJustification;

    @Column(name = "priority")
    private String priority;

    @Column(name = "priority_justification", columnDefinition = "TEXT")
    private String priorityJustification;

    @ElementCollection
    @CollectionTable(
            name = "included_skill_self_training",
            joinColumns = @JoinColumn(name = "self_training_session_id")
    )
    @Column(name = "included_skill_name")
    private List<String> includedSkills = new ArrayList<>();
}
