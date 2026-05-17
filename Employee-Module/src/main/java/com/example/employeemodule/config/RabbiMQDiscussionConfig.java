package com.example.employeemodule.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@Configuration
public class RabbiMQDiscussionConfig {

    public static final String QUEUE = "Discussion_queue";

    @Bean
    public Queue discussionResultQueue() {
        return new Queue("discussion_result_queue", true); 
        // true = durable (reste après redémarrage)
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                         MessageConverter discussionJsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(discussionJsonMessageConverter);
        return template;
    }
    @Bean(name = "discussionQueue")
    public Queue discussionQueue() {
        return new Queue(QUEUE, true); // durable
    }

    @Bean(name = "discussionJsonMessageConverter")
    public MessageConverter discussionJsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
