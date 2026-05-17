package com.example.back.Repository;

import com.example.back.entity.DiplomaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiplomaTypeRepository extends JpaRepository<DiplomaType, Long> {
    // Tu peux ajouter des méthodes personnalisées ici si besoin
}