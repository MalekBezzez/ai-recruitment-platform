package com.example.employeemodule.Service;

import com.example.employeemodule.Repository.CoachingSessionRepository;
import com.example.employeemodule.Repository.SelfTrainingRepository;
import com.example.employeemodule.Repository.StructuredTrainingSessionRepository;
import com.example.employeemodule.Repository.TrainingRecommendationPlanRepository;
import com.example.employeemodule.dto.*;
import com.example.employeemodule.entity.CoachingSession;
import com.example.employeemodule.entity.SelfTraining;
import com.example.employeemodule.entity.StructuredTrainingSession;
import com.example.employeemodule.entity.TrainingRecommendationPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TrainingRecommendationPlanService {

    private final TrainingRecommendationPlanRepository trainingRecommendationPlanRepository;
    private final SelfTrainingRepository selfTrainingRepository;

    private final CoachingSessionRepository coachingSessionRepository;

    private final StructuredTrainingSessionRepository structuredTrainingSessionRepository;

    public TrainingRecommendationPlan savePlan(TrainingRecommendationPlan plan) {
        return trainingRecommendationPlanRepository.save(plan);
    }

    public TrainingRecommendationPlan getPlanById(Long id) {
        return trainingRecommendationPlanRepository.findById(id).orElse(null);
    }

    public List<TrainingRecommendationPlan> getAllPlans() {
        return trainingRecommendationPlanRepository.findAll();
    }

    public void deletePlan(Long id) {
        trainingRecommendationPlanRepository.deleteById(id);
    }

    public TrainingRecommendationPlan updatePlan(TrainingRecommendationPlan plan) {
        return trainingRecommendationPlanRepository.save(plan);
    }


    public List<TrainingRecommendationPlanSummaryDTO> getAllPlanSummaries() {
        List<TrainingRecommendationPlan> plans = trainingRecommendationPlanRepository
                .findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return plans.stream()
                .map(plan -> new TrainingRecommendationPlanSummaryDTO(
                        plan.getId(),
                        plan.getRequester() != null
                                ? plan.getRequester().getFirstname() + " " + plan.getRequester().getLastname()
                                : "Unknown",
                        plan.getCreatedAt(),
                        plan.getStatus()
                ))
                .toList();
    }

    public Map<String, List<SelfTrainingDTO>> getSelfTrainingByPlanId(Long planId) {
        // On récupère tous les self trainings liés à ce plan
        List<SelfTraining> selfTrainings = selfTrainingRepository.findByRecommendationPlanId(planId);

        // Transformation vers le DTO voulu
        List<SelfTrainingDTO> dtoList = selfTrainings.stream()
                .map(selfTraining -> new SelfTrainingDTO(
                        selfTraining.getEmployee().getFirstname() + " " + selfTraining.getEmployee().getLastname(),
                        selfTraining.getEmployee().getId(),
                        selfTraining.getSessions().stream()
                                .map(session -> new SelfTrainingSessionDTO(
                                        session.getTrainingTitle(),
                                        session.getIncludedSkills(),
                                        session.getSkillsJustification(),
                                        session.getTrainingJustification(),
                                        session.getPriority(),
                                        session.getPriorityJustification()
                                ))
                                .toList()
                ))
                .toList();

        // Retourner dans la structure souhaitée
        return Map.of("Self_training", dtoList);
    }

    public List<CoachingDTO> getCoachingByPlanId(Long planId) {
        List<CoachingSession> sessions = coachingSessionRepository.findByTrainingRecommendationPlanId(planId);

        return sessions.stream().map(session -> new CoachingDTO(
                session.getTrainingTitle(),
                session.getIncludedSkills(),
                session.getParticipants().stream()
                        .map(emp -> new ParticipantDTO(emp.getId(), emp.getFirstname() + " " + emp.getLastname()))
                        .toList(),
                session.getSkillsJustification(),
                session.getTrainingJustification(),
                session.getPriority(),
                session.getPriorityJustification(),
                session.getCoach() != null
                        ? new CoachDTO(session.getCoach().getId(), session.getCoach().getFirstname() + " " + session.getCoach().getLastname())
                        : null,
                session.getCoachJustification()
        )).toList();
    }

    public List<StructuredTrainingDTO> getStructuredTrainingByPlanId(Long planId) {
        List<StructuredTrainingSession> sessions =
                structuredTrainingSessionRepository.findByTrainingRecommendationPlanId(planId);

        return sessions.stream().map(session -> new StructuredTrainingDTO(
                session.getTrainingTitle(),
                session.getIncludedSkills(),
                session.getParticipants().stream()
                        .map(emp -> new ParticipantDTO(
                                emp.getId(),
                                emp.getFirstname() + " " + emp.getLastname()
                        ))
                        .toList(),
                session.getSkillsJustification(), // ✅ ajout de skillsJustification
                session.getTrainingJustification(),
                session.getPriority(),
                session.getPriorityJustification()
        )).toList();
    }





}