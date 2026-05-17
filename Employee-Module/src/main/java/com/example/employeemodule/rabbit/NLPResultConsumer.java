package com.example.employeemodule.rabbit;
import org.springframework.amqp.rabbit.annotation.Queue;
import com.example.employeemodule.dto.*;
import com.example.employeemodule.Service.AnalysisResultService;
import com.example.employeemodule.entity.AnalysisResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NLPResultConsumer {



    private final AnalysisResultService resultService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public NLPResultConsumer(AnalysisResultService resultService) {
        this.resultService = resultService;
    }

    @RabbitListener(queues = "nlp_save_results_queue", containerFactory = "nlpRabbitListenerContainerFactory")
    public void consume(AnalysisResultMessage message) {   // <-- ICI: DTO, pas String
        var entities = message.getResults().stream()
                .map(dto -> AnalysisResult.builder()
                        .employeeId(dto.getEmployeeId())
                        .questionnaireId(dto.getQuestionnaireId())
                        .globalSatisfaction(dto.getGlobalSatisfaction())
                        .adjustedSatisfaction(dto.getAdjustedSatisfaction())
                        .dissatisfactionScore(dto.getDissatisfactionScore())
                        .satisfactionCauses(dto.getSatisfactionCauses())
                        .dissatisfactionCauses(dto.getDissatisfactionCauses())
                        .neutralCauses(dto.getNeutralCauses())
                        .build())
                .toList();

        resultService.saveAll(entities);
        System.out.println("✅ NLP Results saved via RabbitMQ (Q" + message.getQuestionnaireId() + ")");
    }
}

