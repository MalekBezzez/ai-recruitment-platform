package com.example.moduleleave.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class CamundaServicee {
    @Value("${camunda.rest-url}")
    private String CAMUNDA_RUN_URL ;

    private final RestTemplate restTemplate;

    public CamundaServicee() {
        this.restTemplate = new RestTemplate();
        this.restTemplate.getInterceptors().add(
                new BasicAuthenticationInterceptor("demo", "demo") // Authentification Camunda
        );
    }

    // Créer un groupe s'il n'existe pas
    public void createGroupIfNotExists(String groupId, String groupName) {
        String url = CAMUNDA_RUN_URL + "/group/" + groupId;
        try {
            restTemplate.getForEntity(url, Object.class); // Vérifie l'existence
        } catch (Exception e) {
            // Crée le groupe
            HttpEntity<Map<String, String>> request = new HttpEntity<>(Map.of(
                    "id", groupId,
                    "name", groupName,
                    "type", "WORKFLOW_ROLE"
            ));
            restTemplate.postForEntity(CAMUNDA_RUN_URL + "/group/create", request, Void.class);
        }
    }

    // CamundaService.java

    public void createUser(Long userId, String username, String email) {
        try {
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", String.valueOf(userId)); // Convertir en String
            profile.put("firstName", username);
            profile.put("email", email);

            Map<String, String> credentials = new HashMap<>();
            credentials.put("password", "SecurePassword123!"); // Mot de passe robuste

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("profile", profile);
            requestBody.put("credentials", credentials);

            ResponseEntity<Void> response = restTemplate.postForEntity(
                    CAMUNDA_RUN_URL + "/user/create",
                    new HttpEntity<>(requestBody),
                    Void.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Échec de la création dans Camunda");
            }
        } catch (Exception e) {
            throw new RuntimeException("Erreur création utilisateur Camunda: " + e.getMessage());
        }
    }
    // Assigner un utilisateur à un groupe (Méthode corrigée)
    public void assignToGroup(String userId, String groupId) {
        try {
            // Vérifie si l'utilisateur existe
            String urlCheckUser = CAMUNDA_RUN_URL + "/user?userId=" + userId;
            ResponseEntity<String> response = restTemplate.getForEntity(urlCheckUser, String.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody().contains("[]")) {
                throw new RuntimeException("User not found in Camunda");
            }

            // Assigner au groupe
            String url = CAMUNDA_RUN_URL + "/group/" + groupId + "/members/" + userId;
            restTemplate.put(url, null);
        } catch (Exception e) {
            throw new RuntimeException("Error assigning user to group: " + e.getMessage());
        }
    }


    // Vérifier l'appartenance à un groupe
    public boolean isUserInGroup(String userId, String groupId) {
        String url = CAMUNDA_RUN_URL + "/group/" + groupId + "/members/" + userId;
        try {
            ResponseEntity<?> response = restTemplate.getForEntity(url, Object.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            return false;
        }
    }
}