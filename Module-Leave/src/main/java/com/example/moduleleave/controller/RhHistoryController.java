package com.example.moduleleave.controller;

import com.example.moduleleave.Service.RhHistoryService;
import com.example.moduleleave.dto.RhTaskHistoryDto;
import com.example.moduleleave.dto.ValidationHistoryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rh-history")

public class RhHistoryController {

    @Autowired
    private RhHistoryService rhHistoryService;

    @GetMapping
    public List<ValidationHistoryDTO> getHistoryGeneric(
            @RequestParam List<String> taskKeys,
            @RequestParam String decisionVariable
    ) {
        return rhHistoryService.getCompletedTasksFiltered(taskKeys, decisionVariable);
    }
}
