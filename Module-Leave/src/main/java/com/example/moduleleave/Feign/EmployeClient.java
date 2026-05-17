package com.example.moduleleave.Feign;

import com.example.moduleleave.config.FeignAuthConfig;
import com.example.moduleleave.dto.EmployeCreateDTO;
import com.example.moduleleave.dto.ProjectDTO;
import com.example.moduleleave.dto.TaskDTO1;
import com.example.moduleleave.entity.Employe;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "Employee-Module",
        configuration = FeignAuthConfig.class) // ou sans "url" si Eureka
public interface EmployeClient {


@GetMapping("/employee/{id}")
EmployeCreateDTO getEmployeById(@PathVariable Long id);


    @GetMapping("/employee/all-employees")
    List<Employe> getAllEmployes();}

