package com.example.employeemodule.config;

import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitListenerConfig {


    @Bean(name = "nlpRabbitListenerContainerFactory")
    public SimpleRabbitListenerContainerFactory nlpRabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            @Qualifier("nlpJsonMessageConverter") MessageConverter converter) {

        var f = new SimpleRabbitListenerContainerFactory();
        f.setConnectionFactory(connectionFactory);
        f.setMessageConverter(converter);
        return f;
    }

}
