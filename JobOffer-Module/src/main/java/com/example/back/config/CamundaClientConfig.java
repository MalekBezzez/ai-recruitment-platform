package com.example.back.config;

import org.camunda.bpm.client.ExternalTaskClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CamundaClientConfig {
/*
    @Bean
    public ExternalTaskClient externalTaskClient() {
        return ExternalTaskClient.create()
                .baseUrl("http://localhost:8090/engine-rest") // Camunda Run REST endpoint
                .asyncResponseTimeout(10000)
                .build();
    }

 */
}

