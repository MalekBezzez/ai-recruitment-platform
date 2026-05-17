package com.example.employeemodule.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class AuthtenticationSuccessListener {
    private static final Logger log = LoggerFactory.getLogger(AuthtenticationSuccessListener.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void processFiles(String directoryPath) {
        File directory = new File(directoryPath);
        File[] files = directory.listFiles((dir, name) -> name.endsWith(".json"));
        if (files == null || files.length == 0) {
            log.warn("No JSON files found in directory: {}", directoryPath);
            return;
        }

        // Process each file exactly once
        for (File file : files) {
            try {
                // Read file content
                String content = Files.readString(file.toPath(), StandardCharsets.UTF_8);
                // Generate unique idTest
                String idTest = UUID.randomUUID().toString();
                // Create message payload
                Map<String, Object> message = new HashMap<>();
                message.put("responses", parseJsonContent(content)); // Adjust based on your JSON structure
                message.put("idTest", idTest);
                // Send to RabbitMQ
                rabbitTemplate.convertAndSend("Discussion_queue", message);
                log.info("Messages from {} sent to RabbitMQ with idTest: {}", file.getName(), idTest);
            } catch (IOException e) {
                log.error("Error reading file {}: {}", file.getName(), e.getMessage());
            }
        }
    }

    private List<Map<String, Object>> parseJsonContent(String content) throws JsonProcessingException {
        // Parse JSON content to match expected format
        // Example: Convert JSON string to List of response maps
        return new ObjectMapper().readValue(content, new TypeReference<List<Map<String, Object>>>() {});
    }
}