package com.example.moduleleave.Repository;


import com.example.moduleleave.dto.EmployeDTO;
import com.example.moduleleave.entity.Employe;
import com.example.moduleleave.entity.LeaveSold;
import com.example.moduleleave.entity.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface LeaveSoldRepository extends JpaRepository<LeaveSold, Integer> {
    List<LeaveSold> findByEmployeIsNull();
    Optional<LeaveSold> findByEmploye_IdAndLeaveType_IdLeaveType(
            Long employeId,
            Long leaveTypeId
    );
    Optional<LeaveSold> findByEmployeAndLeaveType(Employe employe, LeaveType leaveType);}
