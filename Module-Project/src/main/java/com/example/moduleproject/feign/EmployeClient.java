package com.example.moduleproject.feign;

import com.example.moduleproject.config.FeignAuthConfig;
import com.example.moduleproject.dto.EmployeCreateDTO;
import com.example.moduleproject.entity.Employe;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(
        name = "Employee-Module",
        configuration = FeignAuthConfig.class
)
public interface EmployeClient {

    @GetMapping("/employee/{id}")
    EmployeCreateDTO getEmployeById(@PathVariable Long id);;
}


