package com.example.back.feign;


import com.example.back.config.FeignAuthConfig;
import com.example.back.dto.ContractTypeDTO;
import com.example.back.dto.DepartmentDTO;
import com.example.back.dto.EmployeeLightDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "employee-module",
        configuration = FeignAuthConfig.class)


public interface EmployerClient {

    @GetMapping("/employee/{id}")
    EmployeeLightDTO getEmployeById(@PathVariable("id") Long id);  // j'ai l

    @GetMapping("/departments/{id}")
    DepartmentDTO getDepartmentById(@PathVariable("id") Long id);

    @GetMapping("/contract-types/dto/{id}")
    ContractTypeDTO getContractTypeById(@PathVariable("id") Long id);

}
