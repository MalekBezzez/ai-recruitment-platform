package com.example.employeemodule.Repository;
import com.example.employeemodule.entity.SelfTrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SelfTrainingSessionRepository extends JpaRepository<SelfTrainingSession, Long> {
    // Ajoute des méthodes personnalisées si nécessaire
}
