package com.example.employeemodule.Service;

import com.example.employeemodule.Repository.EmployeRepository;
import com.example.employeemodule.entity.Diploma;
import com.example.employeemodule.Repository.DiplomaRepository;
import com.example.employeemodule.entity.Employe;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiplomaService {

    @Autowired
    private DiplomaRepository diplomaRepository;
    @Autowired
    private EmployeRepository employeRepository;
    // Récupérer tous les diplômes
    public List<Diploma> getAllDiplomas() {
        return diplomaRepository.findAll();
    }

    // Récupérer un diplôme par son ID
    public Optional<Diploma> getDiplomaById(int id) {
        return diplomaRepository.findById(id);
    }
    // Ajouter un nouveau diplôme pour un employé spécifique
    public Diploma addDiplomaForEmploye(Long employeId, Diploma diploma) {
        Employe e = employeRepository.findById(employeId)
                .orElseThrow(() -> new EntityNotFoundException("Employé introuvable"));
        diploma.setEmploye(e);
        return diplomaRepository.save(diploma);
    }
    // Récupérer les diplômes d'un employé spécifique
    public List<Diploma> getDiplomasByEmployeId(Long employeId) {
        return diplomaRepository.findByEmployeId(employeId);
    }

    // Ajouter un nouveau diplôme
    public Diploma saveDiploma(Diploma diploma) {
        return diplomaRepository.save(diploma);
    }

    // Supprimer un diplôme
    public void deleteDiploma(int id) {
        diplomaRepository.deleteById(id);
    }

    // Mettre à jour un diplôme
    public Diploma updateDiploma(int id, Diploma diplomaDetails) {
        Diploma diploma = diplomaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diploma not found"));

        diploma.setSpeciality(diplomaDetails.getSpeciality());
        diploma.setInstitution(diplomaDetails.getInstitution());
        diploma.setDiplomeType(diplomaDetails.getDiplomeType());
        diploma.setDiplomaYear(diplomaDetails.getDiplomaYear());

        // Assurez-vous que l'employé ne devienne pas null
        if (diplomaDetails.getEmploye() != null) {
            diploma.setEmploye(diplomaDetails.getEmploye());
        }

        return diplomaRepository.save(diploma);
    }

}