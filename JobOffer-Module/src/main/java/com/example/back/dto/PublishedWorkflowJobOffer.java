package com.example.back.dto;

import java.util.Date;

public record PublishedWorkflowJobOffer(
        Long idJobOffer,
        String JobTitle,
        String departmentName,
        boolean isPublished,
        Date publishDate,
        boolean isCompleted,
        Date completeDate,
        Integer applicationNumber


) {

}
