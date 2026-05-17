package com.example.employeemodule.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitTrainingAndCareerConfig {


    @Value("${rabbitmq.training-recommendation.queue}")
    private String trainingRecommendationQueue;

    @Value("${rabbitmq.training-recommendation.exchange}")
    private String trainingRecommendationExchange;

    @Value("${rabbitmq.training-recommendation.routingkey}")
    private String trainingRecommendationRoutingKey;

    // Career Pathing

    @Value("${rabbitmq.career-pathing.queue}")
    private String careerPathingQueue;

    @Value("${rabbitmq.career-pathing.exchange}")
    private String careerPathingExchange;

    @Value("${rabbitmq.career-pathing.routing-key}")
    private String careerPathingRoutingKey;





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







    // For Career Pathing
    @Bean
    public Queue careerPathingQueue(
            @Value("${rabbitmq.career-pathing.queue}") String queueName) {
        return new Queue(queueName, true);  // true = persistant
    }

    @Bean
    public TopicExchange careerPathingExchange(
            @Value("${rabbitmq.career-pathing.exchange}") String exchangeName) {
        return new TopicExchange(exchangeName);
    }

    @Bean
    public Queue careerPathingResponseQueue(
            @Value("${rabbitmq.career-pathing.response-queue}") String queueName) {
        return new Queue(queueName, true);
    }

    @Bean
    public Binding careerPathingBinding(Queue careerPathingQueue,
                                        TopicExchange careerPathingExchange,
                                        @Value("${rabbitmq.career-pathing.routing-key}") String routingKey) {
        return BindingBuilder
                .bind(careerPathingQueue)
                .to(careerPathingExchange)
                .with(routingKey);
    }




    // ✅ Converter JSON pour garantir l'encodage UTF-8,  RabbitTemplate utilise le sérialiseur Java natif par défaut ❌ → côté Python,
    @Bean("trainingCareerJsonConverter")
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            @Qualifier("trainingCareerJsonConverter") MessageConverter messageConverter) {

        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter);
        return factory;
    }

    // ✅ RabbitTemplate qui utilise ce converter JSON
    @Bean
    public AmqpTemplate customRabbitTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate( connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }



}
