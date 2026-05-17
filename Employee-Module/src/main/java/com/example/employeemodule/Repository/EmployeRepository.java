package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.ContractType;
import com.example.employeemodule.entity.Employe;
import com.example.employeemodule.entity.Insurance;
import com.example.employeemodule.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeRepository extends JpaRepository<Employe, Long> {
    List<Employe> findByManagerId(Long managerId);
    Optional<Employe> findByEmail(String email);
    List<Employe> findByRole(User.Role a);
    List<Employe> findByContractType(ContractType ct);

    boolean existsByEmail(String email);  // email utilisateur
    boolean existsByCIN(String cin);


    long countByInsuranceGroup(Insurance insuranceGroup);

 /*   @Modifying
    @Query("UPDATE Employe e SET e.insuranceGroup = null WHERE e.insuranceGroup.id = :insuranceId")
    void updateInsuranceGroupToNull(@Param("insuranceId") Long insuranceId);*/
    @Query("SELECT e FROM Employe e WHERE e.insuranceGroup = :insurance")
    List<Employe> findEmployesByInsurance(@Param("insurance") Insurance insurance);

    Optional<Employe> findById(Long id);


    @Modifying
    @Query("UPDATE Employe e SET e.insuranceGroup = null WHERE e.insuranceGroup.id = :insuranceId")
    void updateInsuranceGroupToNull(@Param("insuranceId") Long insuranceId);

    List<Employe> findByInsuranceGroup(Insurance insurance);
}