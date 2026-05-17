package com.example.employeemodule.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.amqp.core.Queue; // ✅ BON
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
@Configuration
public class RabbitMQConfig {

    public static final String QUEUE = "nlp_analysis_queue";
    @Bean
    public Queue nlpSaveResultsQueue() {
        return new Queue("nlp_save_results_queue", true);
    }

    @Bean(name = "nlpQueue")
    public Queue nlpQueue() {
        return new Queue(QUEUE, true); // durable
    }

 /*   @Bean(name = "nlpJsonMessageConverter")
    public MessageConverter nlpJsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }*/
}


