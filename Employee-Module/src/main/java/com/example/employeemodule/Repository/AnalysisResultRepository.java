package com.example.employeemodule.Repository;


import com.example.employeemodule.entity.AnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Long> {
    Optional<AnalysisResult> findByEmployeeIdAndQuestionnaireId(Long employeeId, Long questionnaireId);
    List<AnalysisResult> findByQuestionnaireId(Long questionnaireId);

}

