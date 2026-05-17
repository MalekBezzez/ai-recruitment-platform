package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.OtherInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtherInformationRepository extends JpaRepository<OtherInformation, Integer> {
}