package com.example.employeemodule.Repository;
import com.example.employeemodule.entity.SelfTraining;
import com.example.employeemodule.entity.StructuredTrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StructuredTrainingSessionRepository extends JpaRepository<StructuredTrainingSession, Long> {
    // Ajoute des requêtes custom si besoin
    List<StructuredTrainingSession> findByTrainingRecommendationPlanId(Long planId);
}
