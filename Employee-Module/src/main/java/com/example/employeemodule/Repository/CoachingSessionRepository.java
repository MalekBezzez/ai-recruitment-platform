package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.CoachingSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoachingSessionRepository extends JpaRepository<CoachingSession, Long> {
    // Méthodes spécifiques possibles ici
    List<CoachingSession> findByTrainingRecommendationPlanId(Long planId);
}
