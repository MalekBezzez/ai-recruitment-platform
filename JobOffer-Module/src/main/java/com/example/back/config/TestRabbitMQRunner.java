package com.example.back.config;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
/*
@Component
public class TestRabbitMQRunner implements CommandLineRunner {

    private final AmqpTemplate amqpTemplate;

    @Value("${rabbitmq.training-recommendation.exchange}")
    private String exchange;

    @Value("${rabbitmq.training-recommendation.routingkey}")
    private String routingKey;

    public TestRabbitMQRunner(AmqpTemplate amqpTemplate) {
        this.amqpTemplate = amqpTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        String testMessage = "Hello from CommandLineRunner!";
        amqpTemplate.convertAndSend(exchange, routingKey, testMessage);
        System.out.println("✅ Message de test envoyé à RabbitMQ : " + testMessage);
    }




}

 */
