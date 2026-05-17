package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.PredictionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PredictionResultRepository extends JpaRepository<PredictionResult, Long> {
}
