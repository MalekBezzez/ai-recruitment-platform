package com.example.moduleleave.Repository;

import com.example.moduleleave.entity.WorkflowLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface WorkflowLeaveRepository extends JpaRepository<WorkflowLeave, Long> {
    Optional<WorkflowLeave> findByProcessInstanceId(String processInstanceId);
    Optional<WorkflowLeave> findByLeaveRequestId(Long leaveRequestId);

}