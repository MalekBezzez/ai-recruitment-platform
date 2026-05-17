package com.example.back.config;


import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.training-recommendation.queue}")
    private String trainingRecommendationQueue;

    @Value("${rabbitmq.training-recommendation.exchange}")
    private String trainingRecommendationExchange;

    @Value("${rabbitmq.training-recommendation.routingkey}")
    private String trainingRecommendationRoutingKey;

    // Cv- parsing and matching queues
    @Value("${rabbitmq.cv-parsing.queue}")
    private String cvParsingQueue;

    @Value("${rabbitmq.cv-parsing.exchange}")
    private String cvParsingExchange;

    @Value("${rabbitmq.cv-parsing.routingkey}")
    private String cvParsingRoutingKey;



    @Bean
    public Queue trainingRecommendationQueue() {
        return new Queue(trainingRecommendationQueue, true);  // avant false
    }

    @Bean
    public TopicExchange trainingRecommendationExchange() {
        return new TopicExchange(trainingRecommendationExchange);
    }

    @Bean
    public Queue trainingRecommendationResponseQueue(
            @Value("${rabbitmq.training-recommendation.response-queue}") String queueName) {
        return new Queue(queueName, true);
    }

    @Bean
    public Binding trainingRecommendationBinding(Queue trainingRecommendationQueue,
                                                 TopicExchange trainingRecommendationExchange) {
        return BindingBuilder
                .bind(trainingRecommendationQueue)
                .to(trainingRecommendationExchange)
                .with(trainingRecommendationRoutingKey);
    }


    // Exchange , binding for CV parsing module

    @Bean
    public Queue cvParsingQueue() {
        return new Queue(cvParsingQueue, true);
    }

    @Bean
    public TopicExchange cvParsingExchange() {
        return new TopicExchange(cvParsingExchange);
    }

    @Bean
    public Queue cvParsingResponseQueue(
            @Value("${rabbitmq.cv-parsing.response-queue}") String queueName) {
        return new Queue(queueName, true);
    }

    @Bean
    public Binding cvParsingBinding() {
        return BindingBuilder
                .bind(cvParsingQueue())
                .to(cvParsingExchange())
                .with(cvParsingRoutingKey);
    }


    // ✅ Converter JSON pour garantir l'encodage UTF-8,  RabbitTemplate utilise le sérialiseur Java natif par défaut ❌ → côté Python,
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // ✅ RabbitTemplate qui utilise ce converter JSON
    @Bean
    public AmqpTemplate customRabbitTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate( connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }





}
