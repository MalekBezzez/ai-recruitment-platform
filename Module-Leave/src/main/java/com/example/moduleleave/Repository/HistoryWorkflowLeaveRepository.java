package com.example.moduleleave.Repository;

import com.example.moduleleave.entity.HistoryWorkflowLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoryWorkflowLeaveRepository extends JpaRepository<HistoryWorkflowLeave, Long> {

}