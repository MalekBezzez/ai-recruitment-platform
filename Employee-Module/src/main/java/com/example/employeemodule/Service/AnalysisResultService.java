package com.example.employeemodule.Service;


import com.example.employeemodule.dto.AnalysisResultDTO;
import com.example.employeemodule.entity.AnalysisResult;
import com.example.employeemodule.Repository.AnalysisResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnalysisResultService {

    @Autowired
    private AnalysisResultRepository repository;

    public void saveAll(List<AnalysisResult> results) {
        for (AnalysisResult result : results) {
            Optional<AnalysisResult> existing = repository.findByEmployeeIdAndQuestionnaireId(
                    result.getEmployeeId(), result.getQuestionnaireId());

            result.setAnalyzedAt(LocalDateTime.now());

            // Si déjà présent => remplacer (update)
            existing.ifPresent(e -> result.setId(e.getId()));

            repository.save(result); // save() remplace si ID est présent
        }
    }
    public List<AnalysisResultDTO> getDTOByQuestionnaireId(Long questionnaireId) {
        return repository.findByQuestionnaireId(questionnaireId)
                .stream()
                .map(result -> {
                    AnalysisResultDTO dto = new AnalysisResultDTO();
                    dto.setEmployeeId(result.getEmployeeId());
                    dto.setQuestionnaireId(result.getQuestionnaireId());
                    dto.setGlobalSatisfaction(result.getGlobalSatisfaction());
                    dto.setAdjustedSatisfaction(result.getAdjustedSatisfaction());
                    dto.setDissatisfactionScore(result.getDissatisfactionScore());
                    dto.setSatisfactionCauses(result.getSatisfactionCauses());
                    dto.setDissatisfactionCauses(result.getDissatisfactionCauses());
                    dto.setAnalyzedAt(result.getAnalyzedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}

