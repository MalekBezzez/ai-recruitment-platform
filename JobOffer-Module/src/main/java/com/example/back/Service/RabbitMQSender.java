package com.example.back.Service;


import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQSender {

    private final AmqpTemplate amqpTemplate;

    @Value("${rabbitmq.training-recommendation.exchange}")
    private String trainingRecommendationExchange;

    @Value("${rabbitmq.training-recommendation.routingkey}") // du properties
    private String trainingRecommendationRoutingKey;

    //Cv parsing and matching

    @Value("${rabbitmq.cv-parsing.exchange}")
    private String cvParsingExchange;

    @Value("${rabbitmq.cv-parsing.routingkey}")
    private String cvParsingRoutingKey;

    public RabbitMQSender(@Qualifier("customRabbitTemplate")AmqpTemplate amqpTemplate) {
        this.amqpTemplate = amqpTemplate;
    }

    public void send(Object message) {
        amqpTemplate.convertAndSend(trainingRecommendationExchange, trainingRecommendationRoutingKey, message);
        System.out.println(" [x] Sent payload to RabbitMQ: " + message);
    }


    public void sendToCvParsingQueue(Object message) {
        amqpTemplate.convertAndSend(cvParsingExchange, cvParsingRoutingKey, message);
        System.out.println(" [x] Sent payload to CV Parsing queue: " + message);
    }
}
