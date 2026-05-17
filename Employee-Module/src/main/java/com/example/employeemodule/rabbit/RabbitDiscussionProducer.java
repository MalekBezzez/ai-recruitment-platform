package com.example.employeemodule.rabbit;

import com.example.employeemodule.config.RabbiMQDiscussionConfig;
import com.example.employeemodule.dto.NlpAnalysisMessage;
import com.example.employeemodule.dto.NlpAnalysisMessage1;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class RabbitDiscussionProducer {
    private final RabbitTemplate rabbitTemplate;

    public RabbitDiscussionProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendForAnalysis(NlpAnalysisMessage1 message) {
        rabbitTemplate.convertAndSend(RabbiMQDiscussionConfig.QUEUE, message);
    }
}
