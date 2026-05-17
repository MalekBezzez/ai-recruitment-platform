package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.CareerPathingSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CareerPathingSkillRepository extends JpaRepository<CareerPathingSkill, Long> {
    List<CareerPathingSkill> findByJobId(Long jobId);
}
