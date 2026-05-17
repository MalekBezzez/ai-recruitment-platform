package com.example.back.Repository;

import com.example.back.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long>, JpaSpecificationExecutor<Interview> {
    List<Interview> findByApplication_Id(Long applicationId);
    List<Interview> findByApplicationId(Long applicationId);
}
