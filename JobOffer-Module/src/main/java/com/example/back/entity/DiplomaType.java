package com.example.back.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Diploma_Type")
public class DiplomaType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDiplomaType;
    private String speciality;
    private String diplomaName;

}

