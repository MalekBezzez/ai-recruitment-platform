package com.example.back.Repository;

import com.example.back.entity.WorkflowJobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowJobOfferRepository extends JpaRepository<WorkflowJobOffer, Long> {

    // Find a workflow entry by the job offer ID
    Optional<WorkflowJobOffer> findByJobOffer_Id(Long jobOfferId);

    // Find a workflow entry by the process instance ID
    Optional<WorkflowJobOffer> findByProcessInstanceId(String processInstanceId);

    // Find all workflow entries where the job offer was created by the given user Id
    List<WorkflowJobOffer> findByJobOffer_CreatedById(Long userId);

    List<WorkflowJobOffer> findByIsPublishedTrue();
    boolean existsByJobOffer_Id(Long offerId);
}