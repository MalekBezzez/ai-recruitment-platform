package com.example.moduleleave.Repository;


import com.example.moduleleave.entity.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaveTypeRepository extends JpaRepository<LeaveType, Long> {

        boolean existsByType(String type);


}