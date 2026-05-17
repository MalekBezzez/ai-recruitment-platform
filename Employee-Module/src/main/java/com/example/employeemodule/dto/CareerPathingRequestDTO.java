package com.example.employeemodule.dto;

import java.util.List;

public record CareerPathingRequestDTO(
        List<Long> employeeIds,
        Long requesterId
) {}