package com.example.employeemodule.Service;


import com.example.employeemodule.Repository.EmployeRepository;
import com.example.employeemodule.dto.ContractTypeDTO;
import com.example.employeemodule.entity.ContractType;
import com.example.employeemodule.Repository.ContractTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ContractTypeService {
    @Autowired private ContractTypeRepository ctRepo;
    @Autowired private EmployeRepository employeRepo;
    @Autowired
    private ContractTypeRepository repository;

    public ContractType save(ContractType contractType) {
        return repository.save(contractType);
    }

    public List<ContractType> getAll() {
        return repository.findAll();
    }

    public Optional<ContractType> getById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public void delete(Long id) {
        ContractType ct = ctRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ContractType " + id));
        // 1) détacher les employés
        employeRepo.findByContractType(ct).forEach(e -> {
            e.setContractType(null);
            employeRepo.save(e);
        });
        // 2) supprimer le ContractType
        ctRepo.delete(ct);
    }
    public ContractType findById(Long id) {
        // Utilisation de Optional pour éviter les NullPointerException
        Optional<ContractType> contractTypeOptional = repository.findById(id);

        // Si l'entité est trouvée, la retourner, sinon, on peut lancer une exception ou retourner null
        return contractTypeOptional.orElseThrow(() -> new RuntimeException("ContractType not found with id " + id));
    }
    public ContractTypeDTO getDTOById(Long id) {
        return repository.findById(id)
                .map(ContractTypeDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("ContractType introuvable avec l'id : " + id));
    }
    public ContractType getOneById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ContractType with id " + id + " not found"));
    }
}

