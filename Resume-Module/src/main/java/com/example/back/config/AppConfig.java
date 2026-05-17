package com.example.back.config;



import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
public class AppConfig {


   /* @Value("${camunda.activity.mapping}")
    private String activityMapping;

    @Bean(name = "activityStepMapping")
    public Map<String, String> activityStepMapping() {
        return Arrays.stream(activityMapping.split(","))
                .map(String::trim)
                .peek(entry -> {
                    if (!entry.contains("=")) {
                        System.out.println("Entrée invalide détectée: '" + entry + "'");
                    }
                })
                .filter(entry -> entry.contains("="))
                .map(entry -> entry.split("=", 2)) // Split en 2 parties max
                .collect(Collectors.toMap(
                        arr -> arr[0].trim(),
                        arr -> arr[1].trim(),
                        (existing, replacement) -> existing));
    }*/
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer customizer() {
        return builder -> builder
                .featuresToEnable(MapperFeature.DEFAULT_VIEW_INCLUSION)
                .featuresToDisable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
    }
}

