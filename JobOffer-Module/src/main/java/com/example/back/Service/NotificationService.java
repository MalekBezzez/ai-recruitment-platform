package com.example.back.Service;

import com.example.back.Repository.NotificationRepository;
import com.example.back.dto.NotificationDTO;
import com.example.back.dto.RecommendationResponseDTO;
import com.example.back.entity.Notification;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
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

    // ➜ Map globale thread-safe pour chaque utilisateur connecté
    private final Map<String, List<SseEmitter>> userEmitters = new ConcurrentHashMap<>();

    // ✅ ➜ Créer et ajouter un SseEmitter pour un userId donné
    public SseEmitter addEmitter(String userId) {
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
        if (emitters != null) {
            for (SseEmitter emitter : emitters) {
                try {
                    Map<String, String> payload = new HashMap<>();
                    payload.put("title", "New notification");
                    payload.put("message", message);
                    payload.put("timestamp", LocalDateTime.now().toString());

                    emitter.send(
                            SseEmitter.event()
                                    .name("message")
                                    .data(payload) // ✅ Spring va sérialiser en JSON
                    );
                } catch (IOException e) {
                    emitter.completeWithError(e);
                }
            }
        }
    }


    // ✅ ➜ CRUD BDD : obtenir dernières notifications pour un utilisateur
    public List<NotificationDTO> getRecentNotificationsForUser(Long userId) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<NotificationDTO> notifications = repo.findByUserIdAndCreatedAtAfter(userId, thirtyDaysAgo)
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

/*
    @RabbitListener(queues = "${rabbitmq.training-recommendation.response-queue}")
    public void handleTrainingRecommendationResponse(RecommendationResponseDTO message) {
        //System.out.println("✅ Message reçu : " + message);

        Long requesterId = message.requesterId();
        String notificationMessage = "✅ Your training recommendation result is ready.";

        createNotification(requesterId, notificationMessage);
        sendNotificationToUser(String.valueOf(requesterId), notificationMessage);

    }

 */




}
