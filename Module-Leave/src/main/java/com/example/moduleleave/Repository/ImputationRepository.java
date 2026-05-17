package com.example.moduleleave.Repository;


import com.example.moduleleave.entity.Employe;
import com.example.moduleleave.entity.Imputation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
@Repository
public interface ImputationRepository extends JpaRepository<Imputation, Long> {
    List<Imputation> findByEmployee_Id(Long userId);



    void deleteByEmployeeIdAndValideeFalse(Long employeeId);
}

