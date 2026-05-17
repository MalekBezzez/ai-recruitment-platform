package com.example.employeemodule.Service;

import com.example.employeemodule.Repository.CareerPathNeedCompanyRepository;
import com.example.employeemodule.entity.CareerPathNeedCompany;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CareerPathNeedCompanyService {

    private final CareerPathNeedCompanyRepository repository;

    public CareerPathNeedCompany create(CareerPathNeedCompany entity) {
        return repository.save(entity);
    }

    public List<CareerPathNeedCompany> getAll() {
        return repository.findAll();
    }

    public Optional<CareerPathNeedCompany> getById(Long id) {
        return repository.findById(id);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
