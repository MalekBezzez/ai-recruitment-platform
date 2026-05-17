package com.example.modulepayslip.Repository;

import com.example.modulepayslip.entity.Payslip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PayslipRepository extends JpaRepository<Payslip, Long> {
        Optional<Payslip> findTopByUserIdOrderByDateDesc(Long userId);


        @Query("SELECT p FROM Payslip p WHERE p.userId = :userId AND YEAR(p.date) = :year AND MONTH(p.date) = :month")
        Optional<Payslip> findByUserIdAndMonthAndYear(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);

    @Query("SELECT p FROM Payslip p WHERE p.userId = :userId AND EXTRACT(MONTH FROM p.date) = :month AND EXTRACT(YEAR FROM p.date) = :year")
    List<Payslip> findByUserAndMonthAndYear(@Param("userId") Long userId,
                                            @Param("month") int month,
                                            @Param("year") int year);
    @Query("SELECT p FROM Payslip p WHERE EXTRACT(MONTH FROM p.date) = :month AND EXTRACT(YEAR FROM p.date) = :year")
    List<Payslip> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    // déjà existant pour éviter les doublons

}
