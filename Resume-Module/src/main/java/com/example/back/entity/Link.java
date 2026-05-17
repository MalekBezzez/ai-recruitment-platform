package com.example.back.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "link")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Link {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "link_id") // PK en snake_case
    private Long id;

    @Column(name = "link", nullable = false, length = 500) // URL peut être longue
    private String link;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false) // FK vers Resume
    @JsonIgnore
    private Resume resume;

}

