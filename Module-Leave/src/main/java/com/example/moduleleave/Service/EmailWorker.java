package com.example.moduleleave.Service;

import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.client.ExternalTaskClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class EmailWorker {

    private final EmailServiceCamunda emailService;
    private final ExternalTaskClient externalTaskClient;
    public EmailWorker(EmailServiceCamunda emailService,
                       @Value("${camunda.rest-url}") String camundaRestUrl) {
        this.emailService = emailService;
        this.externalTaskClient = ExternalTaskClient.create()
                .baseUrl(camundaRestUrl) // ← maintenant c’est dynamique
                .asyncResponseTimeout(10000)
                .build();

        System.out.println("Initializing EmailWorker");
        this.subscribeToTopics();
    }

    private void subscribeToTopics() {
        // Manager Approval
        externalTaskClient.subscribe("send-approval-email")
                .lockDuration(10000)
                .handler((externalTask, externalTaskService) -> {
                    try {
                        String email = externalTask.getVariable("emailDestinataire");
                        System.out.println(email);
                        Long employeId = externalTask.getVariable("employeId");
                        String commentaire = externalTask.getVariable("commentaireManager");

                        System.out.println("Sending manager approval email for employee: {}" + employeId);
                        emailService.sendDecisionEmail(email, "APPROVED", commentaire, "manager");
                        externalTaskService.complete(externalTask);
                    } catch (Exception e) {
                        System.out.println("Error while processing manager approval task: " + e);
                        externalTaskService.handleFailure(externalTask, e.getMessage(), e.toString(), 0, 30000);
                    }
                })
                .open();

        // Manager Rejection
        externalTaskClient.subscribe("send-rejection-email")
                .lockDuration(10000)
                .handler((externalTask, externalTaskService) -> {
                    try {
                        String email = externalTask.getVariable("emailDestinataire");
                        Long employeId = externalTask.getVariable("employeId");
                        String commentaire = externalTask.getVariable("commentaireManager");

                        System.out.println("Sending manager rejection email for employee: {}" + employeId);
                        emailService.sendDecisionEmail(email, "REJECTED", commentaire, "manager");
                        externalTaskService.complete(externalTask);
                    } catch (Exception e) {
                        System.out.println("Error while processing manager rejection task: " + e);
                        externalTaskService.handleFailure(externalTask, e.getMessage(), e.toString(), 0, 30000);
                    }
                })
                .open();

        // HR Rejection
        externalTaskClient.subscribe("send-rh-rejection-email")
                .lockDuration(10000)
                .handler((externalTask, externalTaskService) -> {
                    try {
                        String email = externalTask.getVariable("emailDestinataire");
                        Long employeId = externalTask.getVariable("employeId");
                        String commentaireRH = externalTask.getVariable("commentaireRH");

                        System.out.println("Sending HR rejection email for employee: {}" + employeId);
                        emailService.sendDecisionEmail(email, "REJECTED", commentaireRH, "hr");

                        // If needed, pass additional variables
                        Map<String, Object> variables = new HashMap<>();
                        // variables.put("rh", "value"); // Uncomment if needed

                        externalTaskService.complete(externalTask, variables);
                    } catch (Exception e) {
                        System.out.println("Error while processing HR rejection task: " + e);
                        externalTaskService.handleFailure(externalTask, e.getMessage(), e.toString(), 0, 30000);
                    }
                })
                .open();

        // Final HR Approval
        externalTaskClient.subscribe("send-final-approval-email")
                .lockDuration(10000)
                .handler((externalTask, externalTaskService) -> {
                    try {
                        String email = externalTask.getVariable("emailDestinataire");
                        System.out.println(email);
                        Long employeId = externalTask.getVariable("employeId");
                        String commentaireRH = externalTask.getVariable("commentaireRH");

                        System.out.println("Sending final HR approval email for employee: {}" + employeId);
                        emailService.sendDecisionEmail(email, "APPROVED", commentaireRH, "hr");
                        externalTaskService.complete(externalTask);
                    } catch (Exception e) {
                        System.out.println("Error during final HR approval: " + e);
                        externalTaskService.handleFailure(externalTask, e.getMessage(), e.toString(), 0, 30000);
                    }
                })
                .open();
    }
}
