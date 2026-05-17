package com.example.back.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "work_mode")
public class WorkMode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idWorkMode;
    private String workModeName;


}
