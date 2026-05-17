package com.example.moduleproject.Repository;

import com.example.moduleproject.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByPhase_PhaseId(Long phaseId);
    List<Task> findByProject_projectIdAndPhaseIsNull(Long projectId);

    long countByPhase_PhaseId(Long phaseId);
    Optional<Task> findByJiraKey(String jiraKey);

    List<Task> findByPhase_PhaseIdAndParentTaskIsNull(Long phaseId);

    List<Task> findByParentTask_TaskId(Long parentId);

}
