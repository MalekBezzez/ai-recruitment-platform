package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
