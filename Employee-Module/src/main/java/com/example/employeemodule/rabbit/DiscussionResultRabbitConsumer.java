package com.example.employeemodule.rabbit;

import com.example.employeemodule.Service.PredictionResultService;
import com.example.employeemodule.dto.PredictionItemDTO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
public class DiscussionResultRabbitConsumer {

    private final PredictionResultService predictionResultService;

    public DiscussionResultRabbitConsumer(PredictionResultService predictionResultService) {
        this.predictionResultService = predictionResultService;
    }

    // Utilise le containerFactory configuré ci-dessous pour forcer Jackson2JsonMessageConverter
    @RabbitListener(
            queues = "discussion_result_queue",
            containerFactory = "rabbitListenerContainerFactory"
    )
    public void consume(@Payload PredictionItemDTO dto) {
        try {
            predictionResultService.save(dto);
            System.out.println("✅ Résultat NLP sauvegardé : " + dto.getEmployeeName());
        } catch (Exception e) {
            System.err.println("❌ Erreur RabbitMQ NLP : " + e.getMessage());
            // Ici tu peux router vers une DLQ si besoin
        }
    }
}
