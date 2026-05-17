package com.example.moduleproject.Repository;

import com.example.moduleproject.entity.Phase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PhaseRepository extends JpaRepository<Phase, Long> {

    List<Phase> findByProject_ProjectId(Long projectId);
}