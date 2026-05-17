package com.example.employeemodule.controller;

        import com.example.employeemodule.dto.InsuranceDTO;
        import com.example.employeemodule.dto.InsuranceDTO1;
        import com.example.employeemodule.entity.Insurance;
        import com.example.employeemodule.Service.InsuranceService;
        import jakarta.persistence.EntityNotFoundException;
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.http.HttpStatus;
        import org.springframework.http.MediaType;
        import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.*;

        import java.util.List;
        import java.util.Optional;
        import java.util.stream.Collectors;
@RestController
@RequestMapping(
        path     = "/insurances",
        produces = MediaType.APPLICATION_JSON_VALUE   // on ne précise plus consumes ici
)

public class InsuranceController {

    @Autowired
    private InsuranceService insuranceService;

    // CREATE
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InsuranceDTO> create(
            @RequestBody InsuranceDTO dto) {
        Insurance saved = insuranceService.createInsurance(InsuranceDTO.toEntity(dto));
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(InsuranceDTO.fromEntity(saved));
    }

    // READ ALL
    @GetMapping
    public List<InsuranceDTO> listAll() {
        return insuranceService.getAllInsurances().stream()
                .map(InsuranceDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<InsuranceDTO> getOne(@PathVariable Long id) {
        return insuranceService.getInsuranceById(id)
                .map(ins -> ResponseEntity.ok(InsuranceDTO.fromEntity(ins)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping(
            path    = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<InsuranceDTO> update(
            @PathVariable Long id,
            @RequestBody InsuranceDTO dto) {
        try {
            Insurance updated = insuranceService.updateInsurance(id, InsuranceDTO.toEntity(dto));
            return ResponseEntity.ok(InsuranceDTO.fromEntity(updated));
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/valid")
    public List<InsuranceDTO> getValidInsurances() {
        // Conversion des assurances valides en DTOs
        return insuranceService.getValidInsurances().stream()
                .map(InsuranceDTO::fromEntity)
                .collect(Collectors.toList());
    }
    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            insuranceService.deleteInsuranceWithBulkUpdate(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}