package com.example.back.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "skill")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id") // Correspond à la PK en base
    private Long id;

    @Column(name = "skill_name", nullable = false, length = 255)
    private String name;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false) // Clé étrangère
    @JsonIgnore
    private Resume resume;
}
