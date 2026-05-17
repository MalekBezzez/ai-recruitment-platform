package com.example.modulepayslip.feign;

import com.example.modulepayslip.Config.FeignAuthConfig;
import com.example.modulepayslip.dto.ImputationDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
@FeignClient(name = "Leave-Module",
        configuration = FeignAuthConfig.class) // adapte le port si besoin
public interface ImputationFeignClient {

    @GetMapping("/imputations/absences/user/{userId}")
    List<ImputationDTO> getAbsencesByUserAndDateRange(
            @PathVariable("userId") Long userId,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    );
}
