package com.example.employeemodule.controller;

import com.example.employeemodule.Service.EmployeeSkillService;
import com.example.employeemodule.Service.RabbitMQSender;
import com.example.employeemodule.dto.CareerPathingRequestDTO;
import com.example.employeemodule.dto.EmployeeSkillAnalyzeRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/employee-skill")
@RequiredArgsConstructor
public class EmployeeSkillController {

    private  final EmployeeSkillService skillService ;
    private  final RabbitMQSender rabbitMQSender ;

    @PostMapping("/process")
    public ResponseEntity<String> processEmployeeSkills(@RequestBody EmployeeSkillAnalyzeRequest request) {

        // 1) Construire le JSON complet
        Map<String, Object> payload = skillService.prepareSkillsForEmployees(
                request.employeeIds(),
                request.requesterId()
        );

        // 2) Pousser vers RabbitMQ
        rabbitMQSender.send(payload);  // sender pour recommendation de fromation

        return ResponseEntity.ok("Training recommendation Request sent !");
    }


    @PostMapping("/career-pathing/process")
    public ResponseEntity<String> processCareerPathing(@RequestBody CareerPathingRequestDTO request) {

        // 1️⃣ Construire le payload
        Map<String, Object> payload = skillService.prepareCareerPathingInput(
                request.employeeIds(),
                request.requesterId()
        );

        // 2️⃣ Envoyer vers RabbitMQ
        rabbitMQSender.sendToCareerPathingQueue(payload);


        return ResponseEntity.ok("Career Pathing request sent !");
    }






}

