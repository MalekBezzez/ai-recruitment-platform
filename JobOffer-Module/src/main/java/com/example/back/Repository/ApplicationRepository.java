package com.example.back.Repository;

import com.example.back.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> , JpaSpecificationExecutor<Application> {
    List<Application> findByJobOffer_Id(Long jobOfferId);

    int countByJobOffer_Id(Long jobOfferId);
}
