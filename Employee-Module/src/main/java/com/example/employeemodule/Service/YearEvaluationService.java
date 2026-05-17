package com.example.employeemodule.Service;


import com.example.employeemodule.Repository.EmployeRepository;
import com.example.employeemodule.entity.Employe;
import com.example.employeemodule.entity.YearEvaluation;
import com.example.employeemodule.Repository.YearEvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class YearEvaluationService {
    @Autowired
    private EmployeRepository employeRepository;

    @Autowired
    private YearEvaluationRepository yearEvaluationRepository;

    public List<YearEvaluation> getAllYearEvaluations() {
        return yearEvaluationRepository.findAll();
    }

    public Optional<YearEvaluation> getYearEvaluationById(int id) {
        return yearEvaluationRepository.findById(id);
    }

    public YearEvaluation saveYearEvaluation(YearEvaluation yearEvaluation) {
        return yearEvaluationRepository.save(yearEvaluation);
    }

    public void deleteYearEvaluation(int id) {
        yearEvaluationRepository.deleteById(id);
    }

    public YearEvaluation updateYearEvaluation(int id, YearEvaluation yearEvaluationDetails) {
        YearEvaluation yearEvaluation = yearEvaluationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("YearEvaluation not found"));
        yearEvaluation.setDate(yearEvaluationDetails.getDate());
        yearEvaluation.setNote(yearEvaluationDetails.getNote());
        yearEvaluation.setEmploye(yearEvaluationDetails.getEmploye());
        return yearEvaluationRepository.save(yearEvaluation);
    }

    public YearEvaluation addYearEvaluationToEmploye(Long employeId, YearEvaluation yearEvaluation) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé avec ID : " + employeId));

        yearEvaluation.setEmploye(employe);
        return yearEvaluationRepository.save(yearEvaluation);
    }
    public List<YearEvaluation> getYearEvaluationsByEmployeId(Long employeId) {
        return yearEvaluationRepository.findByEmploye_Id(employeId);
    }
}