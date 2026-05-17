package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.Insurance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface InsuranceRepository extends JpaRepository<Insurance, Long> {
    @Query("SELECT i FROM Insurance i WHERE i.endDate > CURRENT_DATE")
    List<Insurance> findValidInsurances();

    @Modifying
    @Query("UPDATE Employe e SET e.insuranceGroup = NULL WHERE e.insuranceGroup.id = :insId")
    void clearInsuranceGroup(@Param("insId") Long insId);

}
