package com.example.employeemodule.Service;

import com.example.employeemodule.Repository.EmployeRepository;
import com.example.employeemodule.entity.Employe;
import com.example.employeemodule.entity.Insurance;
import com.example.employeemodule.Repository.InsuranceRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class InsuranceService {
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private InsuranceRepository insuranceRepository;
    @Autowired
    private EmployeRepository employeRepository;
    public Insurance createInsurance(Insurance insurance) {
        return insuranceRepository.save(insurance);
    }
    public Insurance findById(Long id) {
        return insuranceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assurance non trouvée avec l'ID : " + id));
    }


    // Récupérer toutes les assurances
    public List<Insurance> getAllInsurances() {
        return insuranceRepository.findAll();
    }

    // Récupérer une assurance par son ID
    public Optional<Insurance> getInsuranceById(Long id) {
        return insuranceRepository.findById(id);
    }

    // Mettre à jour une assurance
    public Insurance updateInsurance(Long id, Insurance updatedInsurance) {
        // Trouver l'assurance existante par son ID
        Optional<Insurance> existingInsuranceOpt = insuranceRepository.findById(id);

        if (existingInsuranceOpt.isEmpty()) {
            throw new RuntimeException("Assurance non trouvée avec l'ID : " + id);
        }

        // Récupérer l'assurance existante
        Insurance existingInsurance = existingInsuranceOpt.get();

        // Mettre à jour les champs avec les nouvelles valeurs
        existingInsurance.setName(updatedInsurance.getName());
        existingInsurance.setDescription(updatedInsurance.getDescription());
        existingInsurance.setStartDate(updatedInsurance.getStartDate());
        existingInsurance.setEndDate(updatedInsurance.getEndDate());
        existingInsurance.setInsuranceProvider(updatedInsurance.getInsuranceProvider());
        existingInsurance.setContactInfo(updatedInsurance.getContactInfo());

        // Sauvegarder et retourner l'assurance mise à jour
        return insuranceRepository.save(existingInsurance);
    }
    public List<Insurance> getValidInsurances() {
        return insuranceRepository.findValidInsurances();
    }


    // Supprimer une assurance
    @Transactional
    public void deleteInsuranceWithBulkUpdate(Long insuranceId) {
        // Verify the insurance exists
        if (!insuranceRepository.existsById(insuranceId)) {
            throw new EntityNotFoundException("Insurance not found with id: " + insuranceId);
        }

        // Log employees to be updated
        List<Employe> employees = employeRepository.findByInsuranceGroup(insuranceRepository.getReferenceById(insuranceId));
        System.out.println("Found " + employees.size() + " employees with insuranceId " + insuranceId);

        // Bulk update
        employeRepository.updateInsuranceGroupToNull(insuranceId);
        entityManager.flush();
        System.out.println("Bulk update executed for insuranceId " + insuranceId);

        // Verify update
        long remaining = employeRepository.countByInsuranceGroup(insuranceRepository.getReferenceById(insuranceId));
        System.out.println("Remaining employees with insuranceId " + insuranceId + ": " + remaining);

        // Delete the insurance
        insuranceRepository.deleteById(insuranceId);
    }


    @Transactional
    public void deleteInsurance(Long insuranceId) {
        Insurance insurance = insuranceRepository.findById(insuranceId)
                .orElseThrow(() -> new EntityNotFoundException("Insurance not found with id: " + insuranceId));

        // 1. Récupérer tous les employés liés à cette assurance
        List<Employe> employes = employeRepository.findByInsuranceGroup(insurance);

        // 2. Détacher chaque employé (mettre insuranceGroup à null)
        for (Employe employe : employes) {
            employe.setInsuranceGroup(null);
            employeRepository.save(employe); // Persist explicitement le changement
        }

        // 3. Supprimer l'assurance une fois tous les employés détachés
        insuranceRepository.delete(insurance);
    }





}

