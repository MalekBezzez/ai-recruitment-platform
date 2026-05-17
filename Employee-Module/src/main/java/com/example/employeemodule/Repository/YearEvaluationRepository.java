package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.YearEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YearEvaluationRepository extends JpaRepository<YearEvaluation, Integer> {
    List<YearEvaluation> findByEmploye_Id(Long employeId);
}