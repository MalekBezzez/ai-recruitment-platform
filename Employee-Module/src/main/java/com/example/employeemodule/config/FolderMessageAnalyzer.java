package com.example.employeemodule.config;

import com.example.employeemodule.dto.MessageInputDTO;
import com.example.employeemodule.dto.MessageLoader;
import com.example.employeemodule.Service.PredictionService;
import com.example.employeemodule.dto.ResponseDTO1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class FolderMessageAnalyzer {

    @Autowired
    private PredictionService predictionService;

    @Autowired
    private MessageLoader messageLoader;

    public void analyzeMessagesFromFile(String filePath) throws Exception {
        // Generate a unique id_test for this file
        String idTest = UUID.randomUUID().toString();

        // Load messages from the specified JSON file
        List<ResponseDTO1> messages = messageLoader.loadMessagesFromJson(filePath);

        // Create DTO and set id_test
        MessageInputDTO dto = new MessageInputDTO();
        dto.setMessages(messages);
        dto.setIdTest(idTest); // Set the unique id_test

        // Send to RabbitMQ
        predictionService.sendToRabbitMQ(dto);
        System.out.println("Messages from " + filePath + " sent to RabbitMQ with idTest: " + idTest);
    }

    // Overloaded method to process multiple files
    public void analyzeMessagesFromFiles(List<String> filePaths) throws Exception {
        for (String filePath : filePaths) {
            analyzeMessagesFromFile(filePath);
        }
    }
}