package com.example.employeemodule.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "career_pathing_recommendation")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerPathingJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String title;

    @Column(name = "match_percentage")
    private Integer matchPercentage;

    @Column(columnDefinition = "TEXT")
    private String justification;

    @Column(name = "from_company_needs")
    private Boolean fromCompanyNeeds;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id" ) // FK vers CareerPathingEmployee
    private CareerPathingEmployee employee;
}
