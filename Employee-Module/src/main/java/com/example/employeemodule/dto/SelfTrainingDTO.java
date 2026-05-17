package com.example.employeemodule.dto;

import java.util.List;

public record SelfTrainingDTO(
        String employeeName,
        Long idEmployee,
        List<SelfTrainingSessionDTO> selfTrainingSessions
) {
}
