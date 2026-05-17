package com.example.back.controller;


import com.example.back.entity.DiplomaType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diploma-type")
@RequiredArgsConstructor
public class DiplomaTypeController {

    private final com.example.back.Service.DiplomaTypeService diplomaTypeService;

    // CREATE
    @PostMapping
    public ResponseEntity<DiplomaType> createDiploma(@RequestBody DiplomaType diplomaType) {
        DiplomaType created = diplomaTypeService.saveDiploma(diplomaType);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }


    // READ - All
    @GetMapping
    public ResponseEntity<List<DiplomaType>> getAllDiplomas() {

        return ResponseEntity.ok(diplomaTypeService.getAllDiplomas());
    }

    // READ - One by ID
    @GetMapping("/{id}")
    public ResponseEntity<DiplomaType> getDiplomaById(@PathVariable Long id) {
        return ResponseEntity.ok(diplomaTypeService.getDiplomaById(id));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<DiplomaType> updateDiploma(@PathVariable Long id, @RequestBody DiplomaType newDiploma) {
        DiplomaType updated = diplomaTypeService.updateDiploma(id, newDiploma);
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiploma(@PathVariable Long id) {
        diplomaTypeService.deleteDiploma(id);
        return ResponseEntity.noContent().build();
    }
}
