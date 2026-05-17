package com.example.employeemodule.Service;

// PredictionService.java


import com.example.employeemodule.dto.MessageInputDTO;
import com.example.employeemodule.dto.NlpAnalysisMessage1;
import com.example.employeemodule.dto.ResponseDTO;
import com.example.employeemodule.dto.ResponseDTO1;
import com.example.employeemodule.rabbit.RabbitDiscussionProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PredictionService {

    @Value("${fastapi.url}")
    private String fastApiUrl; // ex: http://localhost:8000/predict

    private final RestTemplate restTemplate = new RestTemplate();
    @Autowired
    private RabbitDiscussionProducer rabbitProducer;

   /* public void sendToRabbitMQ(MessageInputDTO inputDto) {
        NlpAnalysisMessage1 message = new NlpAnalysisMessage1();
        message.setResponses(
                inputDto.getMessages().stream().map(msg -> {
                    ResponseDTO r = new ResponseDTO();
                    r.setQuestionText(msg);
                    return r;
                }).collect(Collectors.toList())
        );

        rabbitProducer.sendForAnalysis(message);
    }*/
    public void sendToRabbitMQ(MessageInputDTO inputDto) {
        NlpAnalysisMessage1 message = new NlpAnalysisMessage1();

        message.setResponses(
                inputDto.getMessages().stream().map(msg -> {
                    ResponseDTO1 r = new ResponseDTO1();
                    r.setMessageId(msg.getMessageId());
                    r.setTimestamp(msg.getTimestamp());
                    r.setThreadId(msg.getThreadId());
                    r.setEmployeeId(String.valueOf(Long.valueOf(msg.getEmployeeId().replace("emp_", "")))); // ou emp_001 → 1
                    r.setEmployeeName(msg.getEmployeeName());
                    r.setMessageText(msg.getMessageText());
                    return r;
                }).collect(Collectors.toList())
        );

        rabbitProducer.sendForAnalysis(message);
    }

    public Map<String, Object> getPredictions(MessageInputDTO inputDto) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<MessageInputDTO> request = new HttpEntity<>(inputDto, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(fastApiUrl, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new RuntimeException("Erreur FastAPI : " + response.getStatusCode());
        }
    }
}

