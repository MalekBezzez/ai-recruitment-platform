package com.example.back.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;



@RestController
public class SimpleSseController {

    // ➜ Déclare ta Map globale (thread-safe)
    private final Map<String, List<SseEmitter>> userEmitters = new ConcurrentHashMap<>();

    @GetMapping("/events")
    public SseEmitter streamEvents(@RequestParam String userId) {

        SseEmitter emitter = new SseEmitter(0L); // Connexion sans timeout forcé

        // ➜ Ajoute cet emitter dans la Map userId -> List<SseEmitter>

        userEmitters.computeIfAbsent(userId, key -> new CopyOnWriteArrayList<>()).add(emitter);

        // ➜ Assure le clean correct à la fin
        emitter.onCompletion(() -> removeEmitter(userId, emitter)); // lorsque cnx terminé spring va fait un callback autopatique au SseEmitter approprié
        emitter.onTimeout(() -> removeEmitter(userId, emitter));
        emitter.onError(e -> removeEmitter(userId, emitter));


        return emitter;
    }

    private void removeEmitter(String userId, SseEmitter emitter) {
        List<SseEmitter> emitters = userEmitters.get(userId);
        if (emitters != null) {
            emitters.remove(emitter);
            if (emitters.isEmpty()) {
                userEmitters.remove(userId);
            }
        }
    }

    // ➜ Endpoint pour TESTER un envoi à un user précis
    @PostMapping("/send-test")
    public void sendTestEvent(@RequestParam String userId) {
        List<SseEmitter> emitters = userEmitters.get(userId);
        if (emitters != null) {
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(SseEmitter.event()
                            .name("message")
                            .data("Notification spéciale pour user " + userId + " à " + LocalDateTime.now()));
                } catch (Exception ex) {
                    emitter.completeWithError(ex);
                }
            }
        }
    }


}