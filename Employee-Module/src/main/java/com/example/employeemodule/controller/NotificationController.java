package com.example.employeemodule.controller;

import com.example.employeemodule.Service.NotificationService;
import com.example.employeemodule.dto.NotificationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;


@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService service;

    @PostMapping("/{userId}")
    public NotificationDTO createNotification(
            @PathVariable Long userId,
            @RequestBody String message) {
        return service.createNotification(userId, message);
    }

    @PutMapping("/read/{id}")
    public void markAsRead(@PathVariable Long id) {
        service.markAsRead(id);
    }


    @GetMapping("/{userId}")
    public List<NotificationDTO> getUserNotifications(@PathVariable Long userId) {
        return service.getRecentNotificationsForUser(userId);
    }
    @PostMapping("/external/push")
    public void receiveExternalNotification(@RequestParam Long userId, @RequestBody String message) {
        service.processEventFromQueue(userId, message); // Crée + push SSE
    }

    // what malek added

    // ✅ Nouvel endpoint ➜ Compter les notifications non lues
    @GetMapping("/{userId}/unread/count")
    public long getUnreadCount(@PathVariable Long userId) {
        return service.countUnreadByUserId(userId);
    }

    /**
     *  Établir la connexion SSE persistente pour recevoir les notifications en temps réel
     * Exemple : GET /notifications/events?userId=16
     */
    @GetMapping("/events")
    public SseEmitter streamEvents(@RequestParam String userId) {
        return service.addEmitter(userId);
    }



    /**
     * ➜ Pour tester rapidement côté Postman ou Front (simulateur)
     * Ex: POST /notifications/send-test?userId=16
     */
    @PostMapping("/send-test")
    public void sendTestEvent(@RequestParam String userId) {
        service.sendNotificationToUser(userId, "Notification test");
    }



    @PostMapping("/push/{userId}")
    public void pushNotificationToUser(
            @PathVariable Long userId,
            @RequestBody String message) {

        // Juste push SSE côté Front
        service.sendNotificationToUser(String.valueOf(userId), message);
    }


}