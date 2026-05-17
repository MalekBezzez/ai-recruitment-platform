package com.example.employeemodule.Service;


import com.example.employeemodule.Repository.CareerPathingEmployeeRepository;
import com.example.employeemodule.Repository.CareerPathingJobRepository;
import com.example.employeemodule.Repository.CareerPathingRecommendationPlanRepository;
import com.example.employeemodule.Repository.CareerPathingSkillRepository;
import com.example.employeemodule.dto.CareerPathingRecommendationPlanSummaryDTO;
import com.example.employeemodule.dto.CareerPathingResultDTO;
import com.example.employeemodule.dto.JobDTO;
import com.example.employeemodule.dto.SkillDTO;
import com.example.employeemodule.entity.CareerPathingEmployee;
import com.example.employeemodule.entity.CareerPathingJob;
import com.example.employeemodule.entity.CareerPathingRecommendationPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CareerPathingRecommendationPlanService {

    private final CareerPathingRecommendationPlanRepository recommendationRepository;

    private final CareerPathingEmployeeRepository careerPathingEmployeeRepository;

    private final CareerPathingJobRepository careerPathingJobRepository;

    private final CareerPathingSkillRepository careerPathingSkillRepository;

    public CareerPathingRecommendationPlan save(CareerPathingRecommendationPlan recommendation) {
        return recommendationRepository.save(recommendation);
    }

    public Optional<CareerPathingRecommendationPlan> getById(Long id) {
        return recommendationRepository.findById(id);
    }

    public List<CareerPathingRecommendationPlan> getAll() {
        return recommendationRepository.findAll();
    }

    public void deleteById(Long id) {
        recommendationRepository.deleteById(id);
    }

    public CareerPathingRecommendationPlan update(CareerPathingRecommendationPlan recommendation) {
        return recommendationRepository.save(recommendation);
    }

    public List<CareerPathingRecommendationPlanSummaryDTO> getAllPlansSummary() {
        return recommendationRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(plan -> new CareerPathingRecommendationPlanSummaryDTO(
                        plan.getId(),
                        plan.getRequester() != null
                                ? plan.getRequester().getFirstname() + " " + plan.getRequester().getLastname()
                                : null,
                        plan.getCreatedAt(),
                        plan.getStatus()
                ))
                .toList();
    }


    public List<CareerPathingResultDTO> getCareerPathingResultByPlanId(Long planId) {
        // Récupère les CareerPathingEmployee pour ce plan
        List<CareerPathingEmployee> employees =
                careerPathingEmployeeRepository.findByRecommendationId(planId);

        return employees.stream().map(emp -> {
            // Récupérer les jobs liés à cet employé (via repository)
            List<JobDTO> jobs = careerPathingJobRepository.findByEmployeeId(emp.getId())
                    .stream()
                    .map(job -> {
                        // Récupérer les skills liés à ce job (via repository)
                        List<SkillDTO> skills = careerPathingSkillRepository.findByJobId(job.getId())
                                .stream()
                                .map(skill -> new SkillDTO(
                                        skill.getRelatedSkillName(),
                                        Boolean.TRUE.equals(skill.getIsExistingSkill()) // safe null->false
                                ))
                                .collect(Collectors.toList());

                        return new JobDTO(
                                job.getTitle(),
                                job.getMatchPercentage(),
                                job.getJustification(),
                                skills,
                                Boolean.TRUE.equals(job.getFromCompanyNeeds())
                        );
                    })
                    // *** TRI  MATCH PERCENTAGE ***
                    .sorted((j1, j2) -> Double.compare(j2.matchPercentage(), j1.matchPercentage()))
                    .collect(Collectors.toList());

            String fullName = emp.getEmployee() != null
                    ? emp.getEmployee().getFirstname() + " " + emp.getEmployee().getLastname()
                    : "Unknown";

            return new CareerPathingResultDTO(
                    emp.getEmployee() != null ? emp.getEmployee().getId() : null,
                    fullName,
                    jobs
            );
        }).collect(Collectors.toList());
    }

    // Tu peux ajouter ici d’autres méthodes métier spécifiques si besoin

}
