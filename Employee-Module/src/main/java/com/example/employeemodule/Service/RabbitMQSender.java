package com.example.employeemodule.Service;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


    @Service
    public class RabbitMQSender {

        private final AmqpTemplate amqpTemplate;

        // Training-Recommendation
        @Value("${rabbitmq.training-recommendation.exchange}")
        private String trainingRecommendationExchange;

        @Value("${rabbitmq.training-recommendation.routingkey}") // du properties
        private String trainingRecommendationRoutingKey;



        // ==== Career Pathing ====
        @Value("${rabbitmq.career-pathing.exchange}")
        private String careerPathingExchange;

        @Value("${rabbitmq.career-pathing.routingkey}")
        private String careerPathingRoutingKey;

        public RabbitMQSender(@Qualifier("customRabbitTemplate")AmqpTemplate amqpTemplate) {
            this.amqpTemplate = amqpTemplate;
        }

        public void send(Object message) {
            amqpTemplate.convertAndSend(trainingRecommendationExchange, trainingRecommendationRoutingKey, message);
            System.out.println(" [x] Sent payload to RabbitMQ: " + message);
        }




        // -------------------------
        // Career Pathing
        // -------------------------
        public void sendToCareerPathingQueue(Object message) {
            amqpTemplate.convertAndSend(careerPathingExchange, careerPathingRoutingKey, message);
            System.out.println(" [x] Sent payload to Career Pathing queue: " + message);
        }


    }


