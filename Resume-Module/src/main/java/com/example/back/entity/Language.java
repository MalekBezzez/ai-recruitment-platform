package com.example.back.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "language")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "language_id") // PK en snake_case
    private Long id;

    @Column(name = "language", length = 255)
    private String name;

    @Column(name = "level" , length = 255)
    private String level;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false) // FK vers Resume
    @JsonIgnore
    private Resume resume;
}
