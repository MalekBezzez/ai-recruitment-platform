package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.CareerPathingEmployee;
import com.example.employeemodule.entity.StructuredTrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CareerPathingEmployeeRepository extends JpaRepository<CareerPathingEmployee, Long> {

    List<CareerPathingEmployee>  findByRecommendationId(Long planId);

}
