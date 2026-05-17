package com.example.employeemodule.Service;

import com.example.employeemodule.Repository.*;
import com.example.employeemodule.dto.CareerPathingResponseDTO;
import com.example.employeemodule.dto.NotificationDTO;
import com.example.employeemodule.dto.RecommendationResponseDTO;
import com.example.employeemodule.entity.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;
@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repo;


    @Autowired
    private EmployeRepository employeRepository;

    @Autowired
    private TrainingRecommendationPlanRepository planRepository;
    @Autowired
    private SelfTrainingRepository selfTrainingRepository;

    @Autowired
    private SelfTrainingSessionRepository selfTrainingSessionRepository;

    @Autowired
    private CoachingSessionRepository coachingSessionRepository;

    @Autowired
    private StructuredTrainingSessionRepository structuredTrainingSessionRepository;

    @Autowired
    private CareerPathingRecommendationPlanService careerPathingRecommendationPlanService;


    @Autowired
    private CareerPathingEmployeeRepository careerPathingEmployeeRepository;

    @Autowired
    private CareerPathingJobRepository careerPathingJobRepository;

    @Autowired
    private CareerPathingSkillRepository careerPathingSkillRepository;

    @Autowired
    private CareerPathingRecommendationPlanRepository careerPathingRecommendationPlanRepository;





    // ➜ Map globale thread-safe pour chaque utilisateur connecté
    private final Map<String, List<SseEmitter>> userEmitters = new ConcurrentHashMap<>();

    // ✅ ➜ Créer et ajouter un SseEmitter pour un userId donné
    public SseEmitter addEmitter(String userId)  {
        SseEmitter emitter = new SseEmitter(0L); // Pas de timeout forcé

        // ➜ Ajoute l’emitter à la liste de cet userId
        userEmitters.computeIfAbsent(userId, key -> new CopyOnWriteArrayList<>()).add(emitter);

        // ➜ Retire l’emitter proprement quand la connexion se ferme
        emitter.onCompletion(() -> removeEmitter(userId, emitter));
        emitter.onTimeout(() -> removeEmitter(userId, emitter));
        emitter.onError(e -> removeEmitter(userId, emitter));

        return emitter;
    }

    // ✅ ➜ Nettoyage : retire l’emitter mort
    private void removeEmitter(String userId, SseEmitter emitter) {
        List<SseEmitter> emitters = userEmitters.get(userId);
        if (emitters != null) {
            emitters.remove(emitter);
        }
    }

    public void sendNotificationToUser(String userId, String message) {
        List<SseEmitter> emitters = userEmitters.get(userId);
        if (emitters == null || emitters.isEmpty()) {
            System.out.println("⚠️ Aucun emitter actif pour userId=" + userId);
            return;
        }

        // Utiliser un CopyOnWriteArrayList pour éviter ConcurrentModificationException
        List<SseEmitter> deadEmitters = new ArrayList<>();

        for (SseEmitter emitter : emitters) {
            try {
                Map<String, String> payload = new HashMap<>();
                payload.put("title", "New notification");
                payload.put("message", message);
                payload.put("timestamp", LocalDateTime.now().toString());

                emitter.send(
                        SseEmitter.event()
                                .name("message")
                                .data(payload)
                );

                System.out.println("✅ SSE envoyé à userId=" + userId);

            } catch (IOException e) {
                // L’emitter est probablement mort → on le marque pour suppression
                System.out.println("⚠️ SSE failed pour userId=" + userId + ": emitter mort ou fermé.");
                deadEmitters.add(emitter);

            } catch (IllegalStateException e) {
                // Peut arriver si l’emitter est déjà terminé
                System.out.println("⚠️ SSE failed pour userId=" + userId + ": emitter déjà terminé.");
                deadEmitters.add(emitter);

            } catch (Exception e) {
                // Autres erreurs (ex: sécurité)
                System.out.println("❌ Erreur inattendue lors de l’envoi SSE à userId=" + userId + ": " + e.getMessage());
            }
        }

        // Supprimer les émetteurs morts de la liste
        if (!deadEmitters.isEmpty()) {
            emitters.removeAll(deadEmitters);
            System.out.println("🗑️ Suppression de " + deadEmitters.size() + " emitter(s) mort(s) pour userId=" + userId);
        }
    }


    // ✅ ➜ CRUD BDD : obtenir dernières notifications pour un utilisateur
    public List<NotificationDTO> getRecentNotificationsForUser(Long userId) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<NotificationDTO> notifications = repo.findByUserIdAndCreatedAtAfterOrderByCreatedAtDesc(userId, thirtyDaysAgo)
                .stream()
                .map(NotificationMapper::toDto)
                .collect(Collectors.toList());

        // ✅ Log pour vérifier ce que tu renvoies
        System.out.println("🔍 Notifications récupérées pour userId=" + userId + ": " + notifications);

        return notifications;
    }

    // ✅ ➜ CRUD BDD : marquer une notif comme lue
    public void markAsRead(Long id) {
        Notification notif = repo.findById(id).orElseThrow();
        notif.setRead(true);
        repo.save(notif);
    }

    // ✅ ➜ CRUD BDD : créer une notif en BDD
    public NotificationDTO createNotification(Long userId, String message) {
        Notification notif = new Notification();
        notif.setUserId(userId);
        notif.setMessage(message);
        notif.setCreatedAt(LocalDateTime.now());
        notif.setRead(false);

        Notification saved = repo.save(notif);
        return NotificationMapper.toDto(saved);
    }

    // ✅ ➜ Compter les notifications non lues
    public long countUnreadByUserId(Long userId) {
        return repo.countByUserIdAndReadIsFalse(userId);
    }

    // ✅ ➜ Pour un listener RabbitMQ par exemple
    public void processEventFromQueue(Long userId, String message) {
        // Sauvegarde en BDD
        createNotification(userId, message);

        // Push SSE en temps réel
        sendNotificationToUser(String.valueOf(userId), message);
    }


    @RabbitListener(queues = "${rabbitmq.training-recommendation.response-queue}",
            containerFactory = "rabbitListenerContainerFactory")
    public void handleTrainingRecommendationResponse(RecommendationResponseDTO message) {

        System.out.println("**********************We Are Inside Training rec Listenner") ;

        Long planId = message.trainingRecommendationPlanId();
        Long requesterId = message.requesterId();

        // Charger le plan par ID
        TrainingRecommendationPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan introuvable avec id : " + planId));

        RecommendationResponseDTO.RecommendationPlan recommendationPlan = message.recommendationPlan();

        // --- SELF TRAINING ---
        if (recommendationPlan.Self_training() != null) {
            for (RecommendationResponseDTO.SelfTraining selfTrainingDTO : recommendationPlan.Self_training()) {
                SelfTraining selfTraining = new SelfTraining();
                selfTraining.setRecommendationPlan(plan);

                Employe employee = employeRepository.findById(selfTrainingDTO.id())
                        .orElseThrow(() -> new RuntimeException("Employe non trouvé pour SelfTraining id " + selfTrainingDTO.id()));
                selfTraining.setEmployee(employee);

                List<SelfTrainingSession> sessions = new ArrayList<>();
                if (selfTrainingDTO.self_training_sessions() != null) {
                    for (RecommendationResponseDTO.SelfTrainingSession sessionDTO : selfTrainingDTO.self_training_sessions()) {
                        SelfTrainingSession session = new SelfTrainingSession();
                        session.setSelfTraining(selfTraining);
                        session.setTrainingTitle(sessionDTO.training_title());
                        session.setIncludedSkills(sessionDTO.included_skills());
                        session.setSkillsJustification(sessionDTO.skills_justification());
                        session.setTrainingJustification(sessionDTO.training_justification());
                        session.setPriority(sessionDTO.priority());
                        session.setPriorityJustification(sessionDTO.priority_justification());
                        sessions.add(session);
                    }
                }
                selfTraining.setSessions(sessions);

                selfTrainingRepository.save(selfTraining);
            }
        }

        // --- COACHING ---
        if (recommendationPlan.Coaching() != null) {
            for (RecommendationResponseDTO.Coaching coachingDTO : recommendationPlan.Coaching()) {
                CoachingSession coachingSession = new CoachingSession();
                coachingSession.setTrainingRecommendationPlan(plan);
                coachingSession.setTrainingTitle(coachingDTO.training_title());
                coachingSession.setIncludedSkills(coachingDTO.included_skills());
                coachingSession.setSkillsJustification(coachingDTO.skills_justification());
                coachingSession.setTrainingJustification(coachingDTO.training_justification());
                coachingSession.setPriority(coachingDTO.priority());
                coachingSession.setPriorityJustification(coachingDTO.priority_justification());
                coachingSession.setCoachJustification(coachingDTO.coach_justification());


                Employe coach = employeRepository.findById(coachingDTO.coach())
                        .orElseThrow(() -> new RuntimeException("Coach non trouvé pour id " + coachingDTO.coach()));
                coachingSession.setCoach(coach);

                List<Employe> participants = new ArrayList<>();
                if (coachingDTO.participants() != null) {
                    for (Long participantId : coachingDTO.participants()) {
                        Employe participant = employeRepository.findById(participantId)
                                .orElseThrow(() -> new RuntimeException("Participant non trouvé pour id " + participantId));
                        participants.add(participant);
                    }
                }
                coachingSession.setParticipants(participants);

                coachingSessionRepository.save(coachingSession);
            }
        }

        // --- STRUCTURED TRAINING ---
        if (recommendationPlan.Structured_training() != null) {
            for (RecommendationResponseDTO.StructuredTraining structuredDTO : recommendationPlan.Structured_training()) {
                StructuredTrainingSession structuredSession = new StructuredTrainingSession();

                structuredSession.setTrainingRecommendationPlan(plan);
                structuredSession.setTrainingTitle(structuredDTO.training_title());
                structuredSession.setIncludedSkills(structuredDTO.included_skills());
                structuredSession.setTrainingJustification(structuredDTO.training_justification());
                structuredSession.setPriority(structuredDTO.priority());
                structuredSession.setPriorityJustification(structuredDTO.priority_justification());
                structuredSession.setSkillsJustification(structuredDTO.skills_justification());

                List<Employe> participants = new ArrayList<>();
                if (structuredDTO.participants() != null) {
                    for (Long participantId : structuredDTO.participants()) {
                        Employe participant = employeRepository.findById(participantId)
                                .orElseThrow(() -> new RuntimeException("Participant non trouvé pour id " + participantId));
                        participants.add(participant);
                    }
                }
                structuredSession.setParticipants(participants);

                structuredTrainingSessionRepository.save(structuredSession);
            }
        }

        // Mise à jour du status du plan
        plan.setStatus("COMPLETED");
        planRepository.save(plan);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        String notificationMessage = "✅ Your training recommendation created at "
                + plan.getCreatedAt().format(formatter)
                + " is ready.";
        
        createNotification(requesterId, notificationMessage);
        // Make sure the saving one time
        try {
            sendNotificationToUser(String.valueOf(requesterId), notificationMessage);
        } catch (Exception e) {
            // On log l'erreur mais on n'interrompt pas le listener
           System.out.println("SSE failed for user {}: {}"+ requesterId);
        }
       // sendNotificationToUser(String.valueOf(requesterId), notificationMessage);
    }

    // Tes méthodes createNotification() et sendNotificationToUser() restent inchangées





    @RabbitListener(queues = "${rabbitmq.career-pathing.response-queue}",
            containerFactory = "rabbitListenerContainerFactory")
    public void handleCareerPathingResponse(CareerPathingResponseDTO message) {

        System.out.println("**********************We Are Inside Career Pathing Listenner") ;
        Employe requester = employeRepository.findById(message.requesterId())
                .orElseThrow(() -> new EntityNotFoundException("Requester not found"));

        CareerPathingRecommendationPlan recommendation = careerPathingRecommendationPlanRepository
                .findById(Long.parseLong(message.careerPathingRecommendationId()))
                .orElseThrow(() -> new EntityNotFoundException(
                        "Career Pathing Recommendation not found with ID " + message.careerPathingRecommendationId())
                );

        // Pour chaque employé dans le résultat
        for (CareerPathingResponseDTO.CareerPathingEmployee employeeDTO : message.careerPathingResult()) {
            CareerPathingEmployee employeeEntity = new CareerPathingEmployee();
            Employe employe = employeRepository.findById(Long.parseLong(employeeDTO.employeeId()))
                    .orElseThrow(() -> new EntityNotFoundException("Requester not found"));

            employeeEntity.setEmployee(employe);
            employeeEntity.setRecommendation(recommendation); // lien parent
            careerPathingEmployeeRepository.save(employeeEntity);

            // Pour chaque job recommandé
            for (CareerPathingResponseDTO.CareerPathingJob jobDTO : employeeDTO.recommendedJobs()) {
                CareerPathingJob jobEntity = new CareerPathingJob();
                jobEntity.setTitle(jobDTO.title());
                jobEntity.setMatchPercentage(jobDTO.matchPercentage());
                jobEntity.setJustification(jobDTO.justification());
                jobEntity.setFromCompanyNeeds(jobDTO.fromCompanyNeeds());
                jobEntity.setEmployee(employeeEntity); // lien parent
                careerPathingJobRepository.save(jobEntity);


                // Pour chaque compétence liée
                for (CareerPathingResponseDTO.CareerPathingSkill skillDTO : jobDTO.relatedJobSkills()) {
                    CareerPathingSkill skillEntity = new CareerPathingSkill();
                    skillEntity.setRelatedSkillName(skillDTO.relatedSkillName());
                    skillEntity.setIsExistingSkill(skillDTO.isExistingSkill());
                    skillEntity.setJob(jobEntity); // lien parent
                    careerPathingSkillRepository.save(skillEntity);


                }


            }


        }

        // Sauvegarder

        recommendation.setStatus("COMPLETED");
        careerPathingRecommendationPlanRepository.save(recommendation);

        String requesterId = message.requesterId().toString();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        String notificationMessage = "✅ Your career pathing recommendation created at "
                + recommendation.getCreatedAt().format(formatter)
                + " is ready.";

        createNotification(Long.parseLong(requesterId), notificationMessage);

        // Make sure the saving one time
        try {
            sendNotificationToUser(String.valueOf(requesterId), notificationMessage);
        } catch (Exception e) {
            // On log l'erreur mais on n'interrompt pas le listener
            System.out.println("SSE failed for user {}: {}"+ requesterId);
        }
        // sendNotificationToUser(String.valueOf(requesterId), notificationMessage);

    }



}