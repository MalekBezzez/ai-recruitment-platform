package com.example.employeemodule.controller;

import com.example.employeemodule.dto.ContractTypeDTO;
import com.example.employeemodule.entity.ContractType;
import com.example.employeemodule.Service.ContractTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/contract-types")

public class ContractTypeController {

    @Autowired
    private ContractTypeService service;

    private ContractType fromDTO(ContractTypeDTO dto) {
        ContractType ct = new ContractType();
        ct.setId(dto.getId());
        ct.setContractTypeName(dto.getContractTypeName());
        return ct;
    }

    @GetMapping("/dto/{id}")
    public ResponseEntity<ContractTypeDTO> getContractTypeById(@PathVariable Long id) {
        ContractTypeDTO dto = service.getDTOById(id);
        return ResponseEntity.ok(dto);
    }
    private ContractTypeDTO toDTO(ContractType ct) {
        ContractTypeDTO dto = new ContractTypeDTO();
        dto.setId(ct.getId());
        dto.setContractTypeName(ct.getContractTypeName());
        return dto;
    }

    @PostMapping
    public ContractTypeDTO create(@RequestBody ContractTypeDTO contractTypeDTO) {
        ContractType contractType = fromDTO(contractTypeDTO);
        return toDTO(service.save(contractType));
    }

    @GetMapping
    public List<ContractTypeDTO> getAll() {
        return service.getAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ContractType getById(@PathVariable Long id) {
        return service.getById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public ContractType update(@PathVariable Long id, @RequestBody ContractType updated) {
        ContractType existing = service.getById(id).orElseThrow();
        existing.setContractTypeName(updated.getContractTypeName());
        return service.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
