package com.example.moduleleave.controller;

import com.example.moduleleave.dto.ManagerTaskHistoryDto;
import com.example.moduleleave.Service.ManagerHistoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manager-history")
public class ManagerHistoryController {

    private final ManagerHistoryService managerHistoryService;

    public ManagerHistoryController(ManagerHistoryService managerHistoryService) {
        this.managerHistoryService = managerHistoryService;
    }

    @GetMapping("/{managerId}")
    public List<ManagerTaskHistoryDto> getHistoryForManager(@PathVariable String managerId) {
        return managerHistoryService.getManagerTaskHistory(managerId);
    }
}
