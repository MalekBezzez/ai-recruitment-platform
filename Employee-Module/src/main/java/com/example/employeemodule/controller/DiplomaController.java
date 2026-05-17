package com.example.employeemodule.controller;

import com.example.employeemodule.Repository.EmployeRepository;
import com.example.employeemodule.Service.DiplomaService;
import com.example.employeemodule.Service.EmployeService;
import com.example.employeemodule.dto.DiplomaDTO;
import com.example.employeemodule.entity.Diploma;
import com.example.employeemodule.entity.Employe;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(
        path     = "/diplomas",
        produces = MediaType.APPLICATION_JSON_VALUE
)

public class DiplomaController {

    @Autowired private DiplomaService diplomaService;
    @Autowired private EmployeRepository employeRepository;

    @GetMapping
    public List<DiplomaDTO> getAll() {
        return diplomaService.getAllDiplomas().stream()
                .map(DiplomaDTO::fromEntity)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiplomaDTO> getOne(@PathVariable int id) {
        return diplomaService.getDiplomaById(id)
                .map(DiplomaDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/employee/{employeId}")
    public List<DiplomaDTO> getByEmployee(@PathVariable Long employeId) {
        return diplomaService.getDiplomasByEmployeId(employeId).stream()
                .map(DiplomaDTO::fromEntity)
                .toList();
    }

    @PostMapping(
            path = "/employee/{employeId}",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<DiplomaDTO> addForEmployee(
            @PathVariable Long employeId,
            @RequestBody DiplomaDTO dto
    ) {
        // 1) charger l’employé
        Employe e = employeRepository.findById(employeId)
                .orElseThrow(() -> new EntityNotFoundException("Employé introuvable : " + employeId));
        // 2) construire l’entité sans la relation
        Diploma d = DiplomaDTO.toEntity(dto);
        // 3) lier
        d.setEmploye(e);
        // 4) sauvegarder
        Diploma saved = diplomaService.saveDiploma(d);
        // 5) renvoyer le DTO
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(DiplomaDTO.fromEntity(saved));
    }

    @PutMapping(
            path = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<DiplomaDTO> update(
            @PathVariable int id,
            @RequestBody DiplomaDTO dto
    ) {
        Diploma d = DiplomaDTO.toEntity(dto);
        Diploma updated = diplomaService.updateDiploma(id, d);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(DiplomaDTO.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        diplomaService.deleteDiploma(id);
        return ResponseEntity.noContent().build();
    }




 /*   @PostMapping("/employee/{employeId}")
    public ResponseEntity<Diploma> addDiplomaForEmploye(
            @PathVariable Long employeId,
            @RequestBody Diploma diploma
    ) {
        Diploma saved = diplomaService.addDiplomaForEmploye(employeId, diploma);
        return ResponseEntity.ok(saved);
    }*/

    // Supprimer un diplôme
   /* @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiploma(@PathVariable int id) {
        diplomaService.deleteDiploma(id);
        return ResponseEntity.noContent().build();
    }*/
}