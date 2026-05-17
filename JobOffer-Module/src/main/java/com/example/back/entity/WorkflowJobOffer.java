package com.example.back.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "workflow_job_offer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowJobOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "process_instance_id", nullable = false)
    private String processInstanceId;

    @Column(name = "status_job_offer")
    private String statusJobOffer;

    @OneToOne
    @JoinColumn(name = "job_offer_id", nullable = false)
    private Offer jobOffer;


    @Column(name = "published" ,nullable = false, columnDefinition = "boolean default false")
    private boolean isPublished;

    @Column( name="completed" ,nullable = false, columnDefinition = "boolean default false")
    private boolean isCompleted;

    @Temporal(TemporalType.TIMESTAMP)
    @Column (name = "complete_date")
    private Date completedDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "publish_date")
    private Date publishedDate;
}
// referencedColumnName = "id" (Refers to )