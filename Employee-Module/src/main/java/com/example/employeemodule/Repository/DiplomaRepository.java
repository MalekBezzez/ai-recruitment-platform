package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.Diploma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiplomaRepository extends JpaRepository<Diploma, Integer> {

    List<Diploma> findByEmployeId(Long employeId);
}