package com.example.moduleleave.Repository;

// Repository Interface
import com.example.moduleleave.entity.Employe;
import com.example.moduleleave.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {



    List<LeaveRequest> findByStatus(String status);



    List<LeaveRequest> findByEmployeeId(Long employeeId);


    @Query("SELECT lr FROM LeaveRequest lr "
            + "WHERE lr.employee.id = :employeeId "
            + "  AND lr.startDate <= :endDate "
            + "  AND lr.endDate   >= :startDate")
    Optional<LeaveRequest> findByEmployeeAndDates(
            @Param("employeeId") Long employeeId,
            @Param("startDate")   LocalDate startDate,
            @Param("endDate")     LocalDate endDate
    );
    List<LeaveRequest> findByEmployeeIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long employeeId,
            String status,               // ou utilisez un enum pour fiabiliser
            LocalDate endDate,
            LocalDate startDate
    );

}
