package com.example.back.Repository;

import com.example.back.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    // Méthode pour trouver par email (optionnel)
    Resume findByEmail(String email);

    // Méthode pour vérifier l'existence par email (optionnel)
    boolean existsByEmail(String email);
}
