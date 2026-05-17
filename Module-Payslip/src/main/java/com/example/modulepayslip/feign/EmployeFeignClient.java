package com.example.modulepayslip.feign;

import com.example.modulepayslip.Config.FeignAuthConfig;
import com.example.modulepayslip.dto.EmployeCreateDTO;
import com.example.modulepayslip.dto.EmployeDTO;
import com.example.modulepayslip.entity.Employe;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "Employee-Module",
        configuration = FeignAuthConfig.class)
public interface EmployeFeignClient {
    @GetMapping("/employee/{id}")
    EmployeCreateDTO getEmployeById(@PathVariable Long id);


    @GetMapping("/employee/all-employees")
    List<Employe> getAllEmployes();
    
}
