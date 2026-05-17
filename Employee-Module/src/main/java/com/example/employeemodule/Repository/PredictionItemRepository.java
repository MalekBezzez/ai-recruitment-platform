package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.PredictionItem;
import com.example.employeemodule.entity.PredictionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PredictionItemRepository extends JpaRepository<PredictionItem, Long> {
    List<PredictionItem> findByIdTest(String idTest);

}

