package com.example.back.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Interview")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {

    public enum InterviewStatus {
        SCHEDULED("Scheduled"),
        RESCHEDULED("Rescheduled"),
        COMPLETED("Completed"),
        CANDIDATE_ABSENT("Candidate Absent"),
        INTERNAL_CANCELLED("Internal Cancelled");

        private final String label;

        InterviewStatus(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Interview_Id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "ScheduledDateTime", nullable = false)
    private LocalDateTime scheduledDateTime;

    @Column(nullable = false)
    private Integer duration; // en minutes

    @Column(name = "Meeting_Link")
    private String meetingLink;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewStatus status = InterviewStatus.SCHEDULED;// Temporaire - sera remplacé par une enum ou entité InterviewStatus


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Application_Id", nullable = false)
    private Application application;

    // I add it recently

    /*@ManyToMany
    @JoinTable(
            name = "interview_interviewers",
            joinColumns = @JoinColumn(name = "interview_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private List<Employe> interviewers = new ArrayList<>();


     */

    // pour decouplage

   /* @ElementCollection
    @CollectionTable(
            name = "interview_interviewers",
            joinColumns = @JoinColumn(name = "interview_id")
    )

    /*
    @Column(name = "employee_id")
    private List<Long> interviewerIds = new ArrayList<>();
*/

    @ManyToMany
    @JoinTable(
            name = "interview_interviewers",
            joinColumns = @JoinColumn(name = "interview_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private List<Employe> interviewers = new ArrayList<>();



}



