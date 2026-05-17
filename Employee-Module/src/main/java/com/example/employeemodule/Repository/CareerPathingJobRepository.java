package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.CareerPathingJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CareerPathingJobRepository extends JpaRepository<CareerPathingJob, Long> {
    List<CareerPathingJob> findByEmployeeId(Long employeeId);
}
