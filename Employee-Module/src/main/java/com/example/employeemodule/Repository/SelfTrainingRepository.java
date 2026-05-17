package com.example.employeemodule.Repository;
import com.example.employeemodule.entity.SelfTraining;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SelfTrainingRepository extends JpaRepository<SelfTraining, Long> {

    // Tu peux ajouter des méthodes spécifiques si besoin

    List<SelfTraining> findByRecommendationPlanId(Long planId);
}

