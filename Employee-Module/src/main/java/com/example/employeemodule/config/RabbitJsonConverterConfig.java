package com.example.employeemodule.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.support.converter.DefaultJackson2JavaTypeMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitJsonConverterConfig {

    @Bean(name = "nlpJsonMessageConverter")
    public MessageConverter nlpJsonMessageConverter(ObjectMapper objectMapper) {
        Jackson2JsonMessageConverter c = new Jackson2JsonMessageConverter(objectMapper);

        // Force l’utilisation du type inféré par la signature du listener
        c.setAlwaysConvertToInferredType(true);

        var typeMapper = new DefaultJackson2JavaTypeMapper();
        typeMapper.setTrustedPackages("*");
        c.setJavaTypeMapper(typeMapper);

        return c;
    }
}
