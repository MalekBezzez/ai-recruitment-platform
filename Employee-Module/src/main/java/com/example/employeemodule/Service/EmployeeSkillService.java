package com.example.employeemodule.Service;


import com.example.employeemodule.Repository.CareerPathNeedCompanyRepository;
import com.example.employeemodule.Repository.EmployeRepository;
import com.example.employeemodule.Repository.EmployeeSkillRepository;
import com.example.employeemodule.entity.CareerPathNeedCompany;
import com.example.employeemodule.entity.*;
import com.example.employeemodule.entity.EmployeeSkill;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeSkillService {

    private final EmployeeSkillRepository skillRepository;
    private final EmployeRepository employeRepository;
    private final CareerPathNeedCompanyRepository careerPathNeedCompanyRepository;
    private final TrainingRecommendationPlanService trainingRecommendationPlanService;
    private final CareerPathingRecommendationPlanService careerPathingRecommendationPlanService;

    public Map<String, Object> prepareSkillsForEmployees(List<Long> employeeIds,  Long requesterId) {

        // 1. Récupérer l'employé à partir du requesterId
        Employe requester = employeRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Requester employe not found with ID: " + requesterId));

        // 2. Créer le TrainingRecommendationPlan par setters
        TrainingRecommendationPlan plan = new TrainingRecommendationPlan();
        plan.setRequester(requester);
        plan.setCreatedAt(LocalDateTime.now());
        plan.setStatus("PENDING");

        TrainingRecommendationPlan savedPlan = trainingRecommendationPlanService.savePlan(plan);
        Long planId = savedPlan.getId();




        List<Map<String, Object>> employeesList = new ArrayList<>(); // [ { key1 : value 1 , key2 : Value2} , ...]

        for (Long employeeId : employeeIds) {
            // on parcours les employé

            Employe employe = employeRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employe not found with ID: " + employeeId));
            // On prepare les skills de ce employé
            List<EmployeeSkill> skills = skillRepository.findByEmployeId(employeeId);

            // Construire current_level et target_level
            Map<String, Integer> currentLevelMap = new HashMap<>();
            Map<String, Integer> targetLevelMap = new HashMap<>();

            for (EmployeeSkill skill : skills) {
                currentLevelMap.put(skill.getName(), skill.getCurrentLevel()); // AWS : 5
                targetLevelMap.put(skill.getName(), skill.getTargetLevel());
            }
            // Preparation du format final d'un employé
            Map<String, Object> employeeMap = new HashMap<>();
            employeeMap.put("department", employe.getDepartment().getDepartmentName());
            employeeMap.put("id", employe.getId()); // ou formaté comme "CLD-001"
            employeeMap.put("role", employe.getJobTitle()); // nom du poste occupé
            employeeMap.put("seniority_level", employe.getSeniority().name());
            employeeMap.put("current_level", currentLevelMap);
            employeeMap.put("target_level", targetLevelMap);

            employeesList.add(employeeMap);
        }

        // Format global attendu   Structure finale = { employees: [...], requesterId: X }
        Map<String, Object> finalPayload = new HashMap<>();
        finalPayload.put("employees", employeesList); // { employees : [ { employeMap } , ] }
        finalPayload.put("requesterId", requesterId);
        finalPayload.put("trainingRecommendationPlanId", planId);

        return finalPayload;
    }



    // for case of CareerPathing
/*
    public Map<String, Object> prepareCareerPathingInput(Long employeeId, String requesterId) {
        // Récupération de l'employé
        Employe employe = employeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employe not found with ID: " + employeeId));

        // Récupération des compétences de l'employé
        List<EmployeeSkill> skills = skillRepository.findByEmployeId(employeeId);

        // Préparation de la map des skills avec leur current level
        Map<String, Integer> currentLevelMap = new HashMap<>();
        for (EmployeeSkill skill : skills) {
            currentLevelMap.put(skill.getName(), skill.getCurrentLevel());
        }

        // Création de l’objet employee
        Map<String, Object> employeeMap = new HashMap<>();
        employeeMap.put("employee_id", employe.getId());
        employeeMap.put("role", employe.getJobTitle());
        employeeMap.put("skills_current_level", currentLevelMap);

        // Récupération des "needs" (c’est-à-dire les noms des Career Paths proposés par l'entreprise)
        List<String> needs = careerPathNeedCompanyRepository.findAll().stream()
                .map(CareerPathNeedCompany::getCareerPathName)
                .collect(Collectors.toList());

        // Construction du payload final
        Map<String, Object> finalPayload = new HashMap<>();
        finalPayload.put("requester_id", requesterId);
        finalPayload.put("employee", employeeMap);
        finalPayload.put("needs", needs);

        return finalPayload;
    }


 */


    public Map<String, Object> prepareCareerPathingInput(List<Long> employeeIds, Long requesterId) {

        Employe requester = employeRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Requester Employe not found with ID: " + requesterId));

        // Création et sauvegarde de la recommandation carrière avec setters
        CareerPathingRecommendationPlan recommendation = new CareerPathingRecommendationPlan();
        recommendation.setRequester(requester);
        recommendation.setCreatedAt(LocalDateTime.now());
        recommendation.setStatus("PENDING");

        CareerPathingRecommendationPlan savedRecommendation = careerPathingRecommendationPlanService.save(recommendation);


        List<Map<String, Object>> employeesList = new ArrayList<>();

        for (Long employeeId : employeeIds) {
            // Récupération de l'employé
            Employe employe = employeRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employe not found with ID: " + employeeId));

            // Récupération des compétences
            List<EmployeeSkill> skills = skillRepository.findByEmployeId(employeeId);

            // Préparation du map des niveaux actuels
            Map<String, Integer> currentLevelMap = new HashMap<>();
            for (EmployeeSkill skill : skills) {
                currentLevelMap.put(skill.getName(), skill.getCurrentLevel());
            }

            // Création de la map employé
            Map<String, Object> employeeMap = new HashMap<>();
            employeeMap.put("employee_id", employe.getId());
            employeeMap.put("role", employe.getJobTitle());
            employeeMap.put("skills_current_level", currentLevelMap);

            employeesList.add(employeeMap);
        }

        // Récupération des besoins de l'entreprise
        List<String> needs = careerPathNeedCompanyRepository.findAll().stream()
                .map(CareerPathNeedCompany::getCareerPathName)
                .collect(Collectors.toList());

        // Construction du payload final
        Map<String, Object> finalPayload = new HashMap<>();
        finalPayload.put("employees", employeesList); // <--- liste des employés
        finalPayload.put("needs", needs);
        finalPayload.put("requester_id", requesterId);
        finalPayload.put("careerPathingRecommendationId", savedRecommendation.getId());

        return finalPayload;
    }








}